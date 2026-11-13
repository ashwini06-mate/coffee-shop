import { useEffect, useRef, useState } from 'react'
import { menuItems } from './data'
import Navbar from './components/Navbar'
import Hero, { Marquee } from './components/Hero'
import Story from './components/Story'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Locations from './components/Locations'
import CartDrawer from './components/CartDrawer'
import Checkout from './components/Checkout'
import Footer from './components/Footer'
import { locations, money } from './data'

export default function App() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [activeLocation, setActiveLocation] = useState(locations[0].id)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)
  const featured = menuItems.find((item) => item.featured)
  const pickup = locations.find((place) => place.id === activeLocation) || locations[0]

  const count = cart.reduce((sum, line) => sum + line.qty, 0)
  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0)

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  function notify(message) {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2400)
  }

  function addLine(line) {
    setCart((prev) => {
      const found = prev.find((item) => item.lineId === line.lineId)
      if (found?.qty >= 12) return prev
      if (!found) return [...prev, { ...line, qty: 1 }]
      return prev.map((item) => (item.lineId === line.lineId ? { ...item, qty: item.qty + 1 } : item))
    })
    notify(`${line.name} added`)
  }

  function updateQty(lineId, qty) {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((item) => item.lineId !== lineId)
      return prev.map((item) => (item.lineId === lineId ? { ...item, qty: Math.min(12, qty) } : item))
    })
  }

  function openCheckout() {
    if (!cart.length) return
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  function orderFromCafe(id) {
    setActiveLocation(id)
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={count > 0 ? 'has-cart-bar' : undefined}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Navbar count={count} onCart={() => setCartOpen(true)} />
      <main id="main">
        <Hero featured={featured} onAdd={addLine} />
        <Marquee />
        <Story />
        <Menu
          cart={cart}
          pickupName={`${pickup.name} · ${pickup.city}`}
          onAdd={addLine}
          onChangePickup={() => document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <Gallery onAdd={addLine} />
        <Locations activeId={activeLocation} onSelect={setActiveLocation} onOrder={orderFromCafe} />
      </main>
      <Footer />
      {count > 0 && !cartOpen && !checkoutOpen && (
        <button className="cart-bar" type="button" onClick={() => setCartOpen(true)}>
          <span className="cart-bar-count">{count}</span>
          <span>View order</span>
          <span>{money(total)}</span>
        </button>
      )}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          total={total}
          onClose={() => setCartOpen(false)}
          onQty={updateQty}
          onCheckout={openCheckout}
        />
      )}
      {checkoutOpen && (
        <Checkout
          cart={cart}
          total={total}
          defaultLocation={activeLocation}
          onClose={() => setCheckoutOpen(false)}
          onQty={updateQty}
          onEdit={() => {
            setCheckoutOpen(false)
            setCartOpen(true)
          }}
          onPlaced={() => setCart([])}
        />
      )}
      {toast && (
        <div className={`toast${count > 0 ? ' with-bar' : ''}`} role="status">
          {toast}
        </div>
      )}
    </div>
  )
}
