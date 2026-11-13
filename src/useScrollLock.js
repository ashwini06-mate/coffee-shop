import { useEffect } from 'react'

let locks = 0

export default function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined
    locks += 1
    document.body.classList.add('scroll-lock')
    return () => {
      locks = Math.max(0, locks - 1)
      if (locks === 0) document.body.classList.remove('scroll-lock')
    }
  }, [locked])
}
