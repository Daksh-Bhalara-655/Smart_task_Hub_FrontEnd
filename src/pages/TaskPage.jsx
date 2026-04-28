import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from 'react'
import {
  FiCheckCircle,
  FiClock,
  FiPlusCircle,
  FiRefreshCw,
  FiSearch,
  FiTarget,
  FiUsers,
} from 'react-icons/fi'
import Button from '../components/Button'
import TaskItem from '../components/TaskItem'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../services/taskService'
import { getUsers } from '../services/userService'

const STATUS_FILTERS = ['all', 'pending', 'in-progress', 'completed']

const initialTaskForm = {
  title: '',
  description: '',
  status: 'pending',
  dueDate: '',
  assignedTo: '',
}

function getDayDifference(dateValue) {
  if (!dateValue) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const targetDate = new Date(dateValue)
  targetDate.setHours(0, 0, 0, 0)

  return Math.round((targetDate - today) / 86400000)
}

function countUrgentTasks(tasks) {
  return tasks.filter((task) => {
    if (task.status === 'completed') {
      return false
    }

    const diff = getDayDifference(task.dueDate)
    return diff !== null && diff >= 0 && diff <= 3
  }).length
}

function countOverdueTasks(tasks) {
  return tasks.filter((task) => {
    if (task.status === 'completed') {
      return false
    }

    const diff = getDayDifference(task.dueDate)
    return diff !== null && diff < 0
  }).length
}

async function fetchDashboardData(session) {
  const [tasks, users] = await Promise.all([
    getTasks(session.token),
    session.role === 'admin' ? getUsers(session.token) : Promise.resolve([]),
  ])

  return { tasks, users }
}

export default function TaskPage({ session }) {
  const { role, token } = session
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [taskForm, setTaskForm] = useState(initialTaskForm)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [busyTaskId, setBusyTaskId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm.trim().toLowerCase())

  useEffect(() => {
    let isMounted = true

    async function hydrateDashboard() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchDashboardData({ role, token })

        if (!isMounted) {
          return
        }

        startTransition(() => {
          setTasks(data.tasks)
          setUsers(data.users)
        })

        if (data.users.length > 0) {
          setTaskForm((current) => {
            if (current.assignedTo) {
              return current
            }

            return {
              ...current,
              assignedTo: data.users[0]._id,
            }
          })
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    hydrateDashboard()

    return () => {
      isMounted = false
    }
  }, [role, token])

  function handleTaskFormChange(event) {
    const { name, value } = event.target

    setTaskForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleCreateTask(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setNotice('')

    try {
      await createTask(token, {
        ...taskForm,
        dueDate: taskForm.dueDate || undefined,
      })
      setNotice('Task created successfully.')
      setTaskForm((current) => ({
        ...initialTaskForm,
        assignedTo: current.assignedTo,
      }))
      const data = await fetchDashboardData({ role, token })
      startTransition(() => {
        setTasks(data.tasks)
        setUsers(data.users)
      })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusChange(taskId, status) {
    setBusyTaskId(taskId)
    setError('')
    setNotice('')

    try {
      await updateTask(token, taskId, { status })
      setNotice('Task status updated.')
      const data = await fetchDashboardData({ role, token })
      startTransition(() => {
        setTasks(data.tasks)
        setUsers(data.users)
      })
    } catch (updateError) {
      setError(updateError.message)
    } finally {
      setBusyTaskId('')
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm('Delete this task permanently?')

    if (!confirmed) {
      return
    }

    setBusyTaskId(taskId)
    setError('')
    setNotice('')

    try {
      await deleteTask(token, taskId)
      setNotice('Task deleted.')
      const data = await fetchDashboardData({ role, token })
      startTransition(() => {
        setTasks(data.tasks)
        setUsers(data.users)
      })
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setBusyTaskId('')
    }
  }

  async function handleRefresh() {
    setNotice('')
    setLoading(true)
    setError('')

    try {
      const data = await fetchDashboardData({ role, token })
      startTransition(() => {
        setTasks(data.tasks)
        setUsers(data.users)
      })
    } catch (refreshError) {
      setError(refreshError.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === 'all' || task.status === filter
    const searchableText = [
      task.title,
      task.description,
      task.assignedTo?.name,
      task.assignedTo?.email,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      deferredSearchTerm.length === 0 ||
      searchableText.includes(deferredSearchTerm)

    return matchesFilter && matchesSearch
  })

  const taskTotals = {
    all: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    'in-progress': tasks.filter((task) => task.status === 'in-progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
  }

  const activeTasks = taskTotals.pending + taskTotals['in-progress']
  const urgentTasks = countUrgentTasks(tasks)
  const overdueTasks = countOverdueTasks(tasks)
  const completionRate =
    tasks.length === 0 ? 0 : Math.round((taskTotals.completed / tasks.length) * 100)

  const dashboardMetrics = [
    { label: 'Open work', value: activeTasks, tone: 'accent' },
    { label: 'Completion', value: `${completionRate}%`, tone: 'success' },
    { label: 'Due soon', value: urgentTasks, tone: 'warning' },
    { label: 'Overdue', value: overdueTasks, tone: 'danger' },
  ]

  const sectionNote =
    filteredTasks.length === tasks.length
      ? `${tasks.length} tasks currently in view`
      : `${filteredTasks.length} of ${tasks.length} tasks shown after filtering`

  return (
    <div className="page-stack">
      <section className="panel dashboard-hero">
        <div className="dashboard-hero__copy">
          <p className="eyebrow">Protected dashboard</p>
          <h1>
            {role === 'admin'
              ? 'Drive assignment, momentum, and delivery from one board.'
              : 'See your work clearly and keep it moving.'}
          </h1>
          <p className="hero-copy">
            This board now emphasizes scanability: faster status reading,
            clearer hierarchy, and more breathing room around the work itself.
          </p>
          <div className="hero-actions">
            <Button icon={FiRefreshCw} onClick={handleRefresh} variant="secondary">
              Refresh data
            </Button>
            {role === 'admin' ? (
              <Button
                icon={FiPlusCircle}
                onClick={() =>
                  document
                    .getElementById('task-create-panel')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              >
                Jump to create
              </Button>
            ) : null}
          </div>
        </div>

        <aside className="dashboard-hero__panel">
          <p className="eyebrow">Session overview</p>
          <div className="dashboard-hero__identity">
            <strong>{session.name}</strong>
            <span>{role} access</span>
          </div>

          <div className="dashboard-signal-list">
            <div className="dashboard-signal">
              <span>Visible tasks</span>
              <strong>{tasks.length}</strong>
            </div>
            <div className="dashboard-signal">
              <span>Search mode</span>
              <strong>{searchTerm ? 'Focused' : 'All tasks'}</strong>
            </div>
            <div className="dashboard-signal">
              <span>API route</span>
              <strong>/api</strong>
            </div>
            <div className="dashboard-signal">
              <span>Backend</span>
              <strong>localhost:5000</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="dashboard-metrics">
        {dashboardMetrics.map((metric) => (
          <article className={`metric-card metric-card--${metric.tone}`} key={metric.label}>
            <span className="metric-card__label">{metric.label}</span>
            <strong className="metric-card__value">{metric.value}</strong>
          </article>
        ))}
      </section>

      {error ? <div className="alert alert-danger mb-0">{error}</div> : null}
      {notice ? <div className="alert alert-success mb-0">{notice}</div> : null}

      <section className="content-grid content-grid--dashboard">
        {session.role === 'admin' ? (
          <aside className="panel surface-card" id="task-create-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Admin tools</p>
                <h2>Create a task</h2>
                <p className="section-lead">
                  Create, assign, and send work into the board without leaving
                  this view.
                </p>
              </div>
              <FiUsers aria-hidden="true" />
            </div>

            <form className="stack-form" onSubmit={handleCreateTask}>
              <label className="field-block">
                <span>Task title</span>
                <input
                  className="form-control"
                  name="title"
                  onChange={handleTaskFormChange}
                  placeholder="Ship dashboard filters"
                  required
                  type="text"
                  value={taskForm.title}
                />
              </label>

              <label className="field-block">
                <span>Description</span>
                <textarea
                  className="form-control"
                  name="description"
                  onChange={handleTaskFormChange}
                  placeholder="Summarize the work, dependencies, and expected outcome."
                  required
                  rows="4"
                  value={taskForm.description}
                />
              </label>

              <div className="form-split">
                <label className="field-block">
                  <span>Status</span>
                  <select
                    className="form-select"
                    name="status"
                    onChange={handleTaskFormChange}
                    value={taskForm.status}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>

                <label className="field-block">
                  <span>Due date</span>
                  <input
                    className="form-control"
                    name="dueDate"
                    onChange={handleTaskFormChange}
                    type="date"
                    value={taskForm.dueDate}
                  />
                </label>
              </div>

              <label className="field-block">
                <span>Assign to</span>
                <select
                  className="form-select"
                  name="assignedTo"
                  onChange={handleTaskFormChange}
                  required
                  value={taskForm.assignedTo}
                >
                  {users.length === 0 ? (
                    <option value="">No users available</option>
                  ) : (
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))
                  )}
                </select>
              </label>

              <Button
                disabled={submitting || users.length === 0}
                icon={FiPlusCircle}
                type="submit"
              >
                {submitting ? 'Creating task...' : 'Create task'}
              </Button>
            </form>
          </aside>
        ) : (
          <aside className="panel surface-card">
            <p className="eyebrow">Team note</p>
            <h2>Your view is role-aware.</h2>
            <p className="helper-copy">
              Standard users only see the tasks assigned to them. Admin users can
              also create and assign tasks from this page.
            </p>

            <div className="timeline-list">
              <article className="timeline-item">
                <span className="timeline-item__step">
                  <FiTarget aria-hidden="true" />
                </span>
                <div>
                  <h3>Focus on execution</h3>
                  <p>
                    Use filters and search to narrow the board to what matters
                    right now.
                  </p>
                </div>
              </article>
              <article className="timeline-item">
                <span className="timeline-item__step">
                  <FiClock aria-hidden="true" />
                </span>
                <div>
                  <h3>Watch urgent work</h3>
                  <p>
                    Due soon and overdue counts surface which tasks need
                    attention first.
                  </p>
                </div>
              </article>
              <article className="timeline-item">
                <span className="timeline-item__step">
                  <FiCheckCircle aria-hidden="true" />
                </span>
                <div>
                  <h3>Close the loop</h3>
                  <p>
                    Update task status directly from the card instead of
                    navigating into another screen.
                  </p>
                </div>
              </article>
            </div>
          </aside>
        )}

        <section className="panel surface-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Task board</p>
              <h2>Filter, inspect, and update work</h2>
              <p className="section-note">{sectionNote}</p>
            </div>
          </div>

          <div className="toolbar-row">
            <div aria-label="Task filters" className="status-filter-group" role="tablist">
              {STATUS_FILTERS.map((status) => (
                <button
                  className={filter === status ? 'is-active' : ''}
                  key={status}
                  onClick={() => setFilter(status)}
                  type="button"
                >
                  {status === 'all' ? 'All' : status.replace('-', ' ')}
                  <span>{taskTotals[status]}</span>
                </button>
              ))}
            </div>

            <label className="search-field">
              <FiSearch aria-hidden="true" />
              <input
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, description, or assignee"
                type="search"
                value={searchTerm}
              />
            </label>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading</span>
              </div>
              <p>Loading tasks from the backend...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No matching tasks yet</h3>
              <p>
                {tasks.length === 0
                  ? 'Once the backend returns tasks, they will appear here.'
                  : 'Try a different filter or search term.'}
              </p>
            </div>
          ) : (
            <div className="task-grid">
              {filteredTasks.map((task) => (
                <TaskItem
                  isBusy={busyTaskId === task._id}
                  key={task._id}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                  task={task}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  )
}
