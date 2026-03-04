interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
  isLoading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null
  return (
    <div
      role="dialog"
      aria-modal
      aria-labelledby="confirm-title"
      aria-busy={isLoading}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={isLoading ? undefined : onClose}
    >
      <div
        className="w-full max-w-[320px] bg-white rounded-2xl p-6 text-center shadow-[0_24px_48px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full border-4 border-white bg-[#d92323] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-[0_0_0_2px_#d92323,0_4px_12px_rgba(217,35,35,0.3)]" aria-hidden>
          !
        </div>
        <p id="confirm-title" className="text-black font-medium mb-6 leading-relaxed">{message}</p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-[#d92323] text-white font-bold uppercase text-sm btn-primary hover:bg-[#b81e1e] transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting…' : 'YES'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-white text-black font-bold uppercase text-sm border-2 border-black hover:bg-gray-50 transition-colors active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}
