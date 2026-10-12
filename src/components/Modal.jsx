import { useEffect, useRef } from 'react'

/* Focus moves in on open, is contained while open, Escape closes, focus returns on close. */
export default function Modal({ titleId, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    ref.current.querySelector('button').focus()
    return () => prev?.isConnected && prev.focus()
  }, [])
  const onKey = e => {
    if (e.key === 'Escape') return onClose()
    if (e.key !== 'Tab') return
    const f = ref.current.querySelectorAll('button')
    const first = f[0], last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
  return (
    <div className="backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref} onKeyDown={onKey}>
        {children}
      </div>
    </div>
  )
}
