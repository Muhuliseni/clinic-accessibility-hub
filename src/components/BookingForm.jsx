import { useRef, useState } from 'react'
import { SERVICES } from '../data.js'
import Modal from './Modal.jsx'

const rules = {
  name: v => (v.trim().length < 2 ? 'Enter your full name, for example Amara Nkosi.' : ''),
  email: v => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter an email like name@example.com.'),
  date: v => {
    if (!v) return 'Choose a date for your appointment.'
    const d = new Date(v + 'T00:00:00')
    if (d < new Date(new Date().toDateString())) return 'Choose today or a future date.'
    return [0, 6].includes(d.getDay()) ? 'We are open on weekdays. Choose a Monday to Friday date.' : ''
  },
}
const FIELDS = [
  { id: 'name', label: 'Full name', hint: 'As it appears on your health card.', type: 'text', ac: 'name' },
  { id: 'email', label: 'Email', hint: 'We send your confirmation here.', type: 'email', ac: 'email' },
  { id: 'date', label: 'Preferred date', hint: 'Weekdays only.', type: 'date' },
]

export default function BookingForm({ service, onDone }) {
  const [vals, setVals] = useState({ name: '', email: '', date: '', service: String(service?.id ?? 3) })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState('')
  const [done, setDone] = useState(false)
  const refs = useRef({})

  const check = (id, v) => rules[id](v)
  const blur = id => setErrors(e => ({ ...e, [id]: check(id, vals[id]) }))
  const change = (id, v) => {
    setVals(s => ({ ...s, [id]: v }))
    if (errors[id]) setErrors(e => ({ ...e, [id]: check(id, v) })) // live re-validation once touched
  }
  const submit = e => {
    e.preventDefault()
    const next = Object.fromEntries(Object.keys(rules).map(k => [k, check(k, vals[k])]))
    setErrors(next)
    const bad = Object.keys(next).filter(k => next[k])
    if (bad.length) {
      setAlert(`${bad.length} ${bad.length === 1 ? 'problem' : 'problems'} found. Fix ${bad.map(k => FIELDS.find(f => f.id === k).label).join(', ')}.`)
      refs.current[bad[0]].focus()
    } else { setAlert(''); setDone(true) }
  }
  const chosen = SERVICES.find(s => String(s.id) === vals.service)

  return (
    <section aria-labelledby="bk-h">
      <h2 id="bk-h">Your details</h2>
      <p className="hint">All fields are required.</p>
      {/* assertive: announces immediately on failed submit */}
      <div role="alert" aria-live="assertive" className={alert ? 'summary' : undefined}>{alert}</div>
      <form onSubmit={submit} noValidate>
        <label htmlFor="service">Service</label>
        <select id="service" value={vals.service} onChange={e => change('service', e.target.value)}>
          {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {FIELDS.map(f => {
          const err = errors[f.id]
          return (
            <div key={f.id}>
              <label htmlFor={f.id}>{f.label}</label>
              <input id={f.id} type={f.type} autoComplete={f.ac} value={vals[f.id]} ref={el => (refs.current[f.id] = el)}
                aria-invalid={err ? 'true' : 'false'} aria-describedby={err ? `${f.id}-h ${f.id}-e` : `${f.id}-h`}
                onChange={e => change(f.id, e.target.value)} onBlur={() => blur(f.id)} />
              <p className="hint" id={`${f.id}-h`}>{f.hint}</p>
              {err && <p className="err" id={`${f.id}-e`}>Error: {err}</p>}
            </div>
          )
        })}
        <p><button className="btn" type="submit">Confirm appointment</button></p>
      </form>
      {done && (
        <Modal titleId="ok-h" onClose={() => setDone(false)}>
          <h2 id="ok-h">Appointment requested</h2>
          <p>{chosen.name} on {vals.date}. A confirmation is on its way to {vals.email}.</p>
          <div className="row">
            <button className="btn" onClick={() => onDone(true)}>Back to services</button>
            <button className="btn ghost" onClick={() => setDone(false)}>Close</button>
          </div>
        </Modal>
      )}
    </section>
  )
}
