const STATUS_STYLES: Record<string, string> = {
  Submitted: 'bg-gray-100 text-gray-700',
  Assigned: 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-amber-50 text-amber-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Reported: 'bg-gray-100 text-gray-700',
  Validated: 'bg-blue-50 text-blue-700',
  Dispatched: 'bg-blue-50 text-blue-700',
  'En route': 'bg-amber-50 text-amber-700',
  'On site': 'bg-amber-50 text-amber-700',
  Resolved: 'bg-emerald-50 text-emerald-700',
  Escalated: 'bg-red-50 text-red-700',
  Open: 'bg-gray-100 text-gray-700',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700'}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  )
}
