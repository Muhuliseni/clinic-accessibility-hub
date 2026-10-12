import { useEffect, useRef, useState } from 'react'
import ServiceDirectory from './components/ServiceDirectory.jsx'
import BookingForm from './components/BookingForm.jsx'

export default function App() {
  const [view, setView] = useState('services')
  const [service, setService] = useState(null)
  const h1 = useRef(null)
  const first = useRef(true)
  // On view switch, move focus to the new page heading so screen readers hear where they are.
  useEffect(() => { if (first.current) first.current = false; else h1.current?.focus() }, [view])
  const go = (v, s = null) => { setService(s); setView(v) }

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header>
        <p><strong>Eastbrook Community Clinic</strong></p>
        <nav aria-label="Primary"><ul>
          <li><button className="btn ghost" aria-current={view === 'services' ? 'page' : undefined} onClick={() => go('services')}>Find a service</button></li>
          <li><button className="btn ghost" aria-current={view === 'book' ? 'page' : undefined} onClick={() => go('book')}>Book an appointment</button></li>
        </ul></nav>
      </header>
      <main id="main">
        <h1 tabIndex={-1} ref={h1}>{view === 'services' ? 'Find a service' : 'Book an appointment'}</h1>
        {view === 'services' ? <ServiceDirectory onBook={s => go('book', s)} /> : <BookingForm service={service} onDone={back => back && go('services')} />}
      </main>
      <footer><p>Open Monday to Friday, 8:00 to 17:00. Emergency? Call 112.</p></footer>
    </>
  )
}
