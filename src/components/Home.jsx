import { SERVICES } from '../data.js'

const POPULAR = [3, 5].map(id => SERVICES.find(s => s.id === id))

/* Mirrors wireframes/index.html: Start here, Popular services, Access support. */
export default function Home({ onFind, onBook }) {
  return (
    <>
      <section aria-labelledby="start">
        <h2 id="start">Start here</h2>
        <p>Find a service, check who is available, and book without a phone call.</p>
        <button className="btn" onClick={onFind}>Find a service</button>
      </section>
      <div className="with-aside">
        <section aria-labelledby="pop">
          <h2 id="pop">Popular services</h2>
          {POPULAR.map(s => (
            <article key={s.id} aria-labelledby={`p${s.id}`}>
              <h3 id={`p${s.id}`}>{s.name}</h3>
              <p>{s.blurb}</p>
              <button className="btn" onClick={() => onBook(s)}>Book {s.name}</button>
            </article>
          ))}
        </section>
        <aside aria-labelledby="acc">
          <h2 id="acc">Access support</h2>
          <p>We offer sign language interpreters and large-print letters. Ask when you book.</p>
        </aside>
      </div>
    </>
  )
}
