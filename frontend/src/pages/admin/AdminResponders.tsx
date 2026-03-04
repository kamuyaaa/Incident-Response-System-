import { useEffect, useState } from 'react'
import { getUsers, addResponder, setResponderEnabled } from '../../services'
import type { User } from '../../types/user'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../context/ToastContext'
import { UserCircle, UserPlus } from 'lucide-react'

export default function AdminResponders() {
  const toast = useToast()
  const [responders, setResponders] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addName, setAddName] = useState('')
  const [addEmail, setAddEmail] = useState('')

  const load = async () => {
    try {
      const list = await getUsers({ role: 'responder' })
      setResponders(list)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleToggleEnabled = async (user: User) => {
    setSavingId(user.id)
    try {
      await setResponderEnabled(user.id, !(user.enabled !== false))
      setResponders((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, enabled: u.enabled === false } : u))
      )
      toast(user.enabled === false ? 'Responder enabled.' : 'Responder disabled.', 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSavingId(null)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addName.trim() || !addEmail.trim()) {
      toast('Name and email are required.', 'error')
      return
    }
    setSavingId('add')
    try {
      const newUser = await addResponder({ name: addName.trim(), email: addEmail.trim() })
      setResponders((prev) => [...prev, newUser])
      setAddName('')
      setAddEmail('')
      setShowAdd(false)
      toast('Responder added.', 'success')
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState message={error} onRetry={load} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d92323] text-white text-sm font-medium hover:bg-[#b81e1e]"
        >
          <UserPlus className="w-4 h-4" aria-hidden />
          Add Responder
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl p-4 border border-gray-100 surface-shadow space-y-3"
        >
          <h3 className="font-semibold text-black">New responder</h3>
          <input
            type="text"
            placeholder="Name"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={savingId === 'add'}
              className="px-4 py-2 rounded-xl bg-[#d92323] text-white text-sm font-medium disabled:opacity-70"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAddName(''); setAddEmail(''); }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {responders.length === 0 ? (
        <EmptyState
          title="No responders yet."
          description="Add a responder to assign incidents."
        />
      ) : (
        <ul className="space-y-3">
          {responders.map((user) => (
            <li
              key={user.id}
              className={`bg-white rounded-xl p-4 border border-gray-100 surface-shadow flex items-center gap-4 ${
                user.enabled === false ? 'opacity-60' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <UserCircle className="w-6 h-6 text-gray-500" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                {user.enabled === false && (
                  <span className="inline-block mt-1 text-xs text-amber-700">Disabled (cannot be assigned)</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleToggleEnabled(user)}
                disabled={savingId === user.id}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  user.enabled !== false
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                } disabled:opacity-50`}
              >
                {user.enabled !== false ? 'Disable' : 'Enable'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
