'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { getToken } from '@/lib/auth'
import { Icons } from '@/components/ui/Icons'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/login?next=/dashboard')
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) {
    return (
      <>
        <TopNav />
        <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.Refresh size={24} className="animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <TopNav />
      {children}
    </>
  )
}
