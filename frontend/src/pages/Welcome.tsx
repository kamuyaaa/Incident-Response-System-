import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function Welcome() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated || !user) return
    if (user.role === 'ADMIN') navigate('/admin', { replace: true })
    else if (user.role === 'RESPONDER') navigate('/responder', { replace: true })
    else navigate('/incidents', { replace: true })
  }, [isAuthenticated, user, navigate])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 py-16">
      <Logo />
      <h1 className="font-heading text-3xl font-bold text-black mb-12 tracking-tight">
        Welcome
      </h1>
      <Link
        to="/login"
        className="w-full max-w-[300px] py-4 rounded-full bg-[#d92323] text-white font-bold text-center text-lg btn-primary hover:bg-[#b81e1e] transition-all active:scale-[0.98]"
      >
        Get Started
      </Link>
    </div>
  )
}
