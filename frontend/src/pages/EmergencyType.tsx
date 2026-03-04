import { useNavigate } from 'react-router-dom'
import HamburgerButton from '../components/HamburgerButton'
import { EmergencyTypeIcon } from '../components/EmergencyTypeIcons'

const CATEGORIES = [
  { id: 'medical', label: 'Medical Emergency' },
  { id: 'crime', label: 'Crime & Safety' },
  { id: 'natural', label: 'Natural Disaster' },
  { id: 'road', label: 'Road & Transport' },
  { id: 'fire', label: 'Fire & Rescue' },
  { id: 'public', label: 'Public Safety & Welfare' },
  { id: 'other', label: 'Other' },
] as const

export default function EmergencyType() {
  const navigate = useNavigate()

  const handleSelect = (id: string) => {
    navigate(`/report/send?type=${id}`)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-14 pb-12">
      <header className="flex items-center justify-between absolute top-6 left-6 right-6 z-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2.5 -m-2.5 text-black/80 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <HamburgerButton />
      </header>
      <h1 className="font-heading text-lg font-bold text-black text-center mt-2 mb-5 px-2 leading-snug">
        What kind of emergency are you experiencing?
      </h1>
      <div className="space-y-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#fce7f3] border border-pink-100 text-black text-sm font-medium text-left hover:bg-[#fbcfe8] hover:border-pink-200 active:scale-[0.99] transition-all"
          >
            <EmergencyTypeIcon type={cat.id} />
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
