import { useMenu } from '../context/MenuContext'

export default function HamburgerButton() {
  const { openMenu } = useMenu()
  return (
    <button
      type="button"
      onClick={openMenu}
      className="p-2.5 -m-2.5 text-black/80 hover:bg-gray-100 rounded-xl transition-colors"
      aria-label="Open menu"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}
