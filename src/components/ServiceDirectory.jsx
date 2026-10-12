import { useId, useMemo, useState } from 'react'
import { CATEGORIES, SERVICES, fetchAvailability } from '../data.js'

export default function ServiceDirectory({ onBook }) {
  const [services, setServices] = useState(SERVICES)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState([])
  const panelId = useId()
  const results = useMemo(() => services.filter(s =>
    (!active.length || active.includes(s.category)) &&
    (s.name + ' ' + s.blurb).toLowerCase().includes(query.trim().toLowerCase())), [services, query, active])
  const refresh = async () => {
    if (loading) return // aria-disabled, not disabled: keeps keyboard focus on the button
    setLoading(true); setNotice('Updating availability...')
    const next = await fetchAvailability(services)
    const changed = next.filter((s, i) => s.slots !== services[i].slots).length
    setServices(next); setLoading(false)
    setNotice(`Availability updated. ${changed} ${changed === 1 ? 'service' : 'services'} changed.`)
  }
  const toggle = c => setActive(a => a.includes(c) ? a.filter(x => x !== c) : [...a, c])

  return (
    <div className="with-aside">
      <section aria-labelledby="res-h">
        <h2 id="res-h">Services</h2>
        <form role="search" aria-label="Search services" onSubmit={e => e.preventDefault()}>
          <label htmlFor="q">Search by name or symptom</label>
          <input id="q" type="search" value={query} onChange={e => setQuery(e.target.value)} aria-describedby="q-h" />
          <p className="hint" id="q-h">Example: cough, vaccination, blood pressure</p>
        </form>
        {/* polite live region: announced after typing pauses, never interrupts */}
        <p role="status" aria-live="polite" aria-atomic="true">
          {results.length} {results.length === 1 ? 'service' : 'services'} shown
          {active.length ? `, filtered by ${active.join(' and ')}` : ''}.
        </p>
        <div className="row">
          <button className="btn ghost" aria-disabled={loading} onClick={refresh}>Refresh availability</button>
        </div>
        <p aria-live="polite" aria-atomic="true">{notice}</p>
        <ul aria-label="Services" aria-busy={loading} style={{ listStyle: 'none', padding: 0 }}>
          {results.map(s => (
            <li key={s.id}><article aria-labelledby={`s${s.id}`}>
              <h3 id={`s${s.id}`}>{s.name}</h3>
              <p>{s.blurb} With {s.who}. {s.slots === 0 ? 'Fully booked today.' : `${s.slots} ${s.slots === 1 ? 'slot' : 'slots'} left today.`}</p>
              <button className="btn" onClick={() => onBook(s)}>Book {s.name}</button>
            </article></li>
          ))}
        </ul>
        {!results.length && <p>No services match. Clear a filter or try a different word.</p>}
      </section>
      <aside aria-labelledby="flt-h">
        <h2 id="flt-h">Filter by need</h2>
        <button className="btn ghost" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(o => !o)}>
          Triage level {open ? '(hide)' : '(show)'}
        </button>
        <div id={panelId} hidden={!open} className="row">
          {CATEGORIES.map(c => (
            <button key={c} className="btn ghost" aria-pressed={active.includes(c)} onClick={() => toggle(c)}>{c}</button>
          ))}
          <button className="btn ghost" onClick={() => setActive([])} disabled={!active.length}>Clear filters</button>
        </div>
      </aside>
    </div>
  )
}
