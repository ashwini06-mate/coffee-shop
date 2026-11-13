import { useEffect, useRef, useState } from 'react'
import { locations, money, pickupSlots } from '../data'
import useScrollLock from '../useScrollLock'

const emptyForm = (locationId) => ({
  name: '',
  email: 'hello@brewandbean.example',
  phone: '+91 98450 11048',
  locationId,
  time: '',
  notes: '',
})

function isIndianPhone(value) {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits)
  if (digits.length === 12 && digits.startsWith('91')) return /^91[6-9]\d{9}$/.test(digits)
  return false
}

export default function Checkout({ cart, total, defaultLocation, onClose, onQty, onEdit, onPlaced }) {
  const closeRef = useRef(null)
  const [form, setForm] = useState(() => emptyForm(defaultLocation))
  const [errors, setErrors] = useState({})
  const [confirmation, setConfirmation] = useState(null)
  useScrollLock(true)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (confirmation) closeRef.current?.focus()
  }, [confirmation])

  const cafe = locations.find((place) => place.id === form.locationId) || locations[0]

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function submit(event) {
    event.preventDefault()
    if (!cart.length) return
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Tell us the name for the cup.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email.'
    if (!isIndianPhone(form.phone)) next.phone = 'Enter a 10-digit Indian mobile number.'
    if (!form.time) next.time = 'Choose a pickup time.'
    if (Object.keys(next).length) {
      setErrors(next)
      const first = Object.keys(next)[0]
      document.getElementById(first)?.focus()
      return
    }

    const order = {
      number: `BB-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      time: form.time,
      notes: form.notes.trim(),
      cafe,
      items: cart.map((line) => ({ ...line })),
      total,
    }
    setConfirmation(order)
    onPlaced()
  }

  if (confirmation) {
    return (
      <div className="checkout">
        <div className="checkout-panel confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="confirm-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="52" height="52">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#a33e1c" strokeWidth="2" />
              <path d="M14 25.5 20.5 32 34 16" fill="none" stroke="#a33e1c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="eyebrow">Prototype confirmation</p>
          <h2 id="confirm-title">We’ll have it under {confirmation.name.split(' ')[0]}.</h2>
          <p className="sub">
            Order {confirmation.number} · {confirmation.time} at {confirmation.cafe.name}. No payment was taken, and no café received this order.
          </p>
          <ul className="confirm-list">
            {confirmation.items.map((line) => (
              <li key={line.lineId}>
                <span>
                  {line.qty} × {line.name}
                  {line.detail ? ` · ${line.detail}` : ''}
                </span>
                <span>{money(line.price * line.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="total-row">
            <span>Pickup total</span>
            <strong>{money(confirmation.total)}</strong>
          </p>
          <p className="hint">
            {confirmation.cafe.address}, {confirmation.cafe.region}. A real receipt would go to {confirmation.email}. This demo stops here.
          </p>
          <button ref={closeRef} className="btn btn-primary" type="button" onClick={onClose}>
            Back to Brew & Bean
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout" onClick={onClose}>
      <div
        className="checkout-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(event) => event.stopPropagation()}
      >
        <aside className="summary">
          <p className="eyebrow">Pickup order</p>
          <h2 className="panel-title" id="checkout-title">
            Review
          </h2>
          <div className="summary-lines">
            {cart.length === 0 && <p>Your order is empty.</p>}
            {cart.map((line) => (
              <div className="cart-line" key={line.lineId}>
                <div>
                  <strong>{line.name}</strong>
                  {line.detail && <p className="line-detail">{line.detail}</p>}
                  <div className="stepper">
                    <button type="button" onClick={() => onQty(line.lineId, line.qty - 1)} aria-label={`Decrease ${line.name}`}>
                      −
                    </button>
                    <span>{line.qty}</span>
                    <button type="button" onClick={() => onQty(line.lineId, line.qty + 1)} aria-label={`Increase ${line.name}`}>
                      +
                    </button>
                  </div>
                </div>
                <span className="price">{money(line.price * line.qty)}</span>
              </div>
            ))}
          </div>
          <div className="total-row">
            <span>Pickup total</span>
            <strong className="price">{money(total)}</strong>
          </div>
          <button className="text-btn light" type="button" onClick={onEdit}>
            Back to order
          </button>
        </aside>
        <form className="checkout-form" onSubmit={submit} noValidate>
          <div className="form-head">
            <h2 className="panel-title">Pickup details</h2>
            <button ref={closeRef} className="text-btn" type="button" onClick={onClose}>
              Close
            </button>
          </div>
          <p className="hint">Prototype checkout. We’ll show a confirmation, but no payment is taken and no café receives this order.</p>
          <div className="form-grid">
            <label className="field">
              <span>Name for the order</span>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={form.name}
                aria-invalid={errors.name ? 'true' : 'false'}
                onChange={(event) => update('name', event.target.value)}
              />
              {errors.name && <small className="error" role="alert">{errors.name}</small>}
            </label>
            <div className="form-row">
              <label className="field">
                <span>Email</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="hello@brewandbean.example"
                  value={form.email}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  onChange={(event) => update('email', event.target.value)}
                />
                {errors.email && <small className="error" role="alert">{errors.email}</small>}
              </label>
              <label className="field">
                <span>Phone</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+91 98450 11048"
                  value={form.phone}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  onChange={(event) => update('phone', event.target.value)}
                />
                {errors.phone && <small className="error" role="alert">{errors.phone}</small>}
              </label>
            </div>
            <label className="field">
              <span>Café</span>
              <select
                id="locationId"
                value={form.locationId}
                onChange={(event) => update('locationId', event.target.value)}
              >
                {locations.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name} · {place.city}
                  </option>
                ))}
              </select>
              <small className="hint">{cafe.address}, {cafe.region}</small>
            </label>
            <label className="field">
              <span>Pickup time</span>
              <select
                id="time"
                value={form.time}
                aria-invalid={errors.time ? 'true' : 'false'}
                onChange={(event) => update('time', event.target.value)}
              >
                <option value="">Select a time</option>
                {pickupSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    Today, {slot}
                  </option>
                ))}
              </select>
              {errors.time && <small className="error" role="alert">{errors.time}</small>}
            </label>
            <label className="field">
              <span>Note for the bar <em>(optional)</em></span>
              <textarea
                id="notes"
                rows="3"
                value={form.notes}
                onChange={(event) => update('notes', event.target.value)}
                placeholder="Extra hot, two lids, a birthday candle…"
              />
            </label>
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={!cart.length}>
            Place pickup order
          </button>
        </form>
      </div>
    </div>
  )
}
