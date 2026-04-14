'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch, ApiError } from '@/lib/api'
import { clearToken } from '@/lib/auth'

export default function SettingsPage() {
  const router = useRouter()

  // Change password state
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  // Delete account state
  const [deletePw, setDeletePw] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.')
      return
    }
    if (newPw.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }
    setPwLoading(true)
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ old_password: oldPw, new_password: newPw }),
      })
      setPwSuccess('Password updated successfully.')
      setOldPw('')
      setNewPw('')
      setConfirmPw('')
    } catch (err) {
      setPwError(err instanceof ApiError ? err.message : 'Failed to update password.')
    } finally {
      setPwLoading(false)
    }
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault()
    setDeleteError('')
    setDeleteLoading(true)
    try {
      await apiFetch('/auth/account', {
        method: 'DELETE',
        body: JSON.stringify({ password: deletePw }),
      })
      clearToken()
      router.replace('/')
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Failed to delete account.')
      setDeleteLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-8 text-2xl font-bold text-zinc-100">Settings</h1>

      {/* Change Password */}
      <section className="mb-8 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-5 text-base font-semibold text-zinc-200">Change Password</h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">Current password</label>
            <input
              type="password"
              value={oldPw}
              onChange={e => setOldPw(e.target.value)}
              required
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">New password</label>
            <input
              type="password"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              required
              minLength={8}
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">Confirm new password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              required
              minLength={8}
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          {pwError && <p className="text-xs text-red-400">{pwError}</p>}
          {pwSuccess && <p className="text-xs text-green-400">{pwSuccess}</p>}
          <button
            type="submit"
            disabled={pwLoading}
            className="rounded bg-cyan-400 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pwLoading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="mb-2 text-base font-semibold text-red-400">Danger Zone</h2>
        <p className="mb-4 text-xs text-zinc-500">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-400 hover:border-red-500/70 hover:text-red-300 transition-colors"
          >
            Delete my account
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="flex flex-col gap-4">
            <p className="text-xs text-zinc-400">Enter your password to confirm deletion:</p>
            <input
              type="password"
              value={deletePw}
              onChange={e => setDeletePw(e.target.value)}
              required
              placeholder="Your password"
              className="w-full rounded border border-red-500/30 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-red-400 focus:outline-none"
            />
            {deleteError && <p className="text-xs text-red-400">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={deleteLoading}
                className="rounded bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Deleting…' : 'Permanently delete'}
              </button>
              <button
                type="button"
                onClick={() => { setShowDeleteConfirm(false); setDeletePw(''); setDeleteError('') }}
                className="rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
