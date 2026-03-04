interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className="text-red-600 font-medium mb-2" role="alert">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-[#d92323] text-white text-sm font-medium hover:bg-[#b81e1e] transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
