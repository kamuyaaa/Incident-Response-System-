import { Link, useSearchParams } from 'react-router-dom'
import HamburgerButton from '../components/HamburgerButton'

export default function ThankYou() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') || '10003'

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-14 pb-12">
      <header className="flex items-center justify-between absolute top-6 left-6 right-6 z-10">
        <Link
          to="/home"
          className="p-2.5 -m-2.5 text-black/80 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        <HamburgerButton />
      </header>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="font-heading text-2xl font-bold text-black mb-12 max-w-[280px] leading-snug">
          Thank You for Reporting the Incident
        </h1>
        <Link
          to={`/report/${id}/progress`}
          className="w-full max-w-[300px] py-4 rounded-2xl bg-[#d92323] text-white font-bold uppercase text-center text-sm btn-primary hover:bg-[#b81e1e] transition-all active:scale-[0.99]"
        >
          TRACK PROGRESS
        </Link>
      </div>
    </div>
  )
}
