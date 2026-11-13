import { useEffect, useRef } from 'react'
import { money } from '../data'
import useScrollLock from '../useScrollLock'

export default function CartDrawer({ cart, total, onClose, onQty, onCheckout }) {
  const closeRef = useRef(null)
  useScrollLock(true)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const count = cart.reduce((sum, line) => sum + line.qty, 0)

  return (
    <div className="overlay" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="drawer-head">
          <h2 className="panel-title" id="cart-title">
            Your order
            {count > 0 && <span className="panel-meta">{count} {count === 1 ? 'item' : 'items'}</span>}
          </h2>
          <button ref={closeRef} className="text-btn" type="button" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-block">
              <p>The bar is open. Add a drink to start a pickup order.</p>
              <button
                className="btn btn-dark"
                type="button"
                onClick={() => {
                  onClose()
                  window.setTimeout(() => {
                    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
                  }, 40)
                }}
              >
                Browse the menu
              </button>
            </div>
          ) : (
            cart.map((line) => (
              <div className="cart-line" key={line.lineId}>
                <div>
                  <strong>{line.name}</strong>
                  {line.detail && <p className="line-detail">{line.detail}</p>}
                  <div className="stepper" aria-label={`Quantity for ${line.name}`}>
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
            ))
          )}
        </div>
        {cart.length > 0 && (
          <footer className="drawer-foot">
            <div className="total-row">
              <span>Pickup total</span>
              <strong className="price">{money(total)}</strong>
            </div>
            <p className="hint">Pay at the café. This prototype does not charge a card.</p>
            <button className="btn btn-primary btn-block" type="button" onClick={onCheckout}>
              Continue to pickup details
            </button>
          </footer>
        )}
      </aside>
    </div>
  )
}
