import { AlertTriangle, Trash2, X, CheckCircle, Info } from 'lucide-react'

const ConfirmationDialog = ({
  isOpen,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmLabel = 'Ya',
  cancelLabel = 'Batal',
  variant = 'danger', // 'danger', 'warning', 'info'
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null

  const icons = {
    danger: Trash2,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle
  }

  const colors = {
    danger: {
      icon: 'bg-accent-rose/20 text-accent-rose',
      button: 'bg-accent-rose hover:bg-accent-rose/90 text-white',
      border: 'border-accent-rose/30'
    },
    warning: {
      icon: 'bg-warning/20 text-warning',
      button: 'bg-warning hover:bg-warning/90 text-white',
      border: 'border-warning/30'
    },
    info: {
      icon: 'bg-accent-blue/20 text-accent-blue',
      button: 'bg-accent-blue hover:bg-accent-blue/90 text-white',
      border: 'border-accent-blue/30'
    }
  }

  const Icon = icons[variant] || icons.danger
  const colorScheme = colors[variant] || colors.danger

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md bg-surface-1 rounded-2xl border border-hairline shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-hairline-soft">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${colorScheme.icon} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-ink-muted hover:text-white hover:bg-surface-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-ink leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary py-2.5"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${colorScheme.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog
