import { useState } from 'react'
import { locations } from '../data'

const flagship = locations[0]

const year = new Date().getFullYear()

export default function Footer() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [joined, setJoined] = useState(false)

  function submit(event) {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email.')
      return
    }
    setError('')
    setJoined(true)
  }

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <p className="foot-label">Roastery</p>
          <p>
            Roast House
            <br />
            {flagship.address}
            <br />
            {flagship.region}
          </p>
          <p>
            <a href={`tel:${flagship.tel}`}>{flagship.phone}</a>
            <br />
            <a href={`mailto:${flagship.email}`}>{flagship.email}</a>
          </p>
        </div>
        <div>
          <p className="foot-label">Flagship hours</p>
          <p>
            {flagship.hours.map(([days, time]) => (
              <span key={days}>
                {days}, {time}
                <br />
              </span>
            ))}
          </p>
          <p>Cupping flights, Saturdays at 10.</p>
        </div>
        <div>
          <p className="foot-label">Explore</p>
          <ul>
            <li><a href="#story">Story</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#coffees">Coffees</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#locations">Cafés</a></li>
          </ul>
        </div>
        <div>
          <p className="foot-label">Roast notes</p>
          {joined ? (
            <p>You’re on the list. We’ll write when the next single origin lands — in this demo, that’s as far as it goes.</p>
          ) : (
            <form onSubmit={submit} noValidate>
              <p>A short note when a new coffee hits the shelf.</p>
              <label className="field footer-field">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={error ? 'true' : 'false'}
                />
                {error && <small className="error" role="alert">{error}</small>}
              </label>
              <button className="btn btn-primary" type="submit">
                Get the note
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="wrap footer-end">
        <p className="footer-mark">
          Roast <em>House</em>
        </p>
        <div className="legal">
          <span>© {year} Roast House. A fictional café brand.</span>
          <span>Orders placed here are not prepared or charged.</span>
        </div>
      </div>
    </footer>
  )
}
