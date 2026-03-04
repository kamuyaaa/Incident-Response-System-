import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmergencyNumbersModal from '../components/EmergencyNumbersModal'
import HamburgerButton from '../components/HamburgerButton'
import RoleSelector from '../components/RoleSelector'

export default function Home() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-14 pb-12">
      <header className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between">
        <HamburgerButton />
        <RoleSelector />
      </header>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="font-heading text-2xl font-bold text-black/90 mb-10 leading-snug">
          Need an emergency service?
        </p>
        <Link
          to="/report/type"
          className="block w-full max-w-[300px] py-8 rounded-[2rem] bg-[#d92323] text-white font-heading font-bold uppercase text-center text-lg leading-tight hover:bg-[#c41f1f] transition-all active:scale-[0.98] shadow-[0_0_0_1px_rgba(217,35,35,0.4),0_8px_32px_-4px_rgba(217,35,35,0.4),0_0_60px_-10px_rgba(217,35,35,0.35)]"
        >
          Report
          <br />
          Incident
        </Link>
        <p className="text-black/70 uppercase text-sm font-medium tracking-wider mt-8 mb-3">Or</p>
        <button
          type="button"
          onClick={() => setShowEmergencyModal(true)}
          className="text-[#d92323] font-semibold uppercase text-sm underline decoration-2 underline-offset-2 hover:no-underline"
        >
          Emergency Call
        </button>
      </div>
      <EmergencyNumbersModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  )
}
