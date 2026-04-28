import { FiCalendar, FiTrash2, FiUser } from 'react-icons/fi'
import Button from './Button'

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
]

function formatDate(dateValue) {
  if (!dateValue) {
    return 'No due date'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue))
}

function getAssignedLabel(task) {
  if (task.assignedTo && typeof task.assignedTo === 'object') {
    return task.assignedTo.name || task.assignedTo.email
  }

  if (task.assignedUserMissing) {
    return 'Assigned user removed'
  }

  return 'Task owner unavailable'
}

export default function TaskItem({ isBusy, onDelete, onStatusChange, task }) {
  return (
    <article className="task-card">
      <div className="task-card__header">
        <div className="task-card__title-block">
          <span className={`status-pill status-pill--${task.status}`}>
            {task.status.replace('-', ' ')}
          </span>
          <h3>{task.title}</h3>
        </div>
        <Button
          className="task-card__delete"
          disabled={isBusy}
          icon={FiTrash2}
          onClick={() => onDelete(task._id)}
          variant="quiet"
        >
          Remove
        </Button>
      </div>

      <p className="task-card__description">{task.description}</p>

      <div className="task-card__meta-grid">
        <div className="task-card__meta-item">
          <span>
            <FiCalendar aria-hidden="true" />
            Due date
          </span>
          <strong>{formatDate(task.dueDate)}</strong>
        </div>
        <div className="task-card__meta-item">
          <span>
            <FiUser aria-hidden="true" />
            Assignee
          </span>
          <strong>{getAssignedLabel(task)}</strong>
        </div>
      </div>

      <label className="task-card__control">
        <span>Update status</span>
        <select
          className="form-select"
          disabled={isBusy}
          onChange={(event) => onStatusChange(task._id, event.target.value)}
          value={task.status}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </article>
  )
}
