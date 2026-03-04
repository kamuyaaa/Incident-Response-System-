import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDemoAccounts } from '../mock/auth.service'
import Logo from '../components/Logo'

export default function Login() {
  const { login, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const demoAccounts = getDemoAccounts()

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loggedIn = await login(email.trim(), password.trim())
      refreshUser()
      setLoading(false)
      const path = loggedIn.role === 'ADMIN' ? '/admin' : loggedIn.role === 'RESPONDER' ? '/responder' : '/incidents'
      setTimeout(() => navigate(path, { replace: true }), 0)
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
      <Logo />
      <h1 className="font-heading text-2xl font-bold text-black mb-2">Sign in</h1>
      <p className="text-gray-600 text-sm mb-6">Demo mode — use the accounts below</p>

      <div className="w-full max-w-sm mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Demo accounts</p>
        <ul className="space-y-2">
          {demoAccounts.map((acc) => (
            <li key={acc.email} className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-700 truncate">
                {acc.email} <span className="text-gray-400">({acc.role})</span>
              </span>
              <button
                type="button"
                onClick={() => fillDemo(acc.email, acc.password)}
                className="shrink-0 px-2 py-1 rounded-lg bg-[#d92323] text-white text-xs font-medium hover:bg-[#b81e1e]"
              >
                Fill
              </button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-2">Click Fill to use each account (password is filled automatically).</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-black mb-1">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            placeholder="admin@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d92323]/30"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-black mb-1">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#d92323]/30"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#d92323] text-white font-semibold text-sm hover:bg-[#b81e1e] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
