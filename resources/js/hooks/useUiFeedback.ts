import { useState } from 'react'

export function useUiFeedback() {
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    type: 'success' | 'error'
  }>({ open: false, message: '', type: 'success' })

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, type })
    setTimeout(() => {
      setToast(t => ({ ...t, open: false }))
    }, 2500)
  }

  return {
    toast,
    showToast,
  }
}
