import { useEffect, useState } from 'react'
import Logo from './Logo'
import useScrollLock from '../useScrollLock'

const links = [
  { href: '#story', id: 'story', label: 'Story' },
  { href: '#menu', id: 'menu', label: 'Menu' },
  { href: '#gallery', id: 'gallery', label: 'Gallery' },
  { href: '#coffees', id: 'coffees', label: 'Coffees' },
  { href: '#locations', id: 'locations', label: 'Cafés' },
]

export default function Navbar({ count, onCart }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useScrollLock(open)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = links.map((link) => document.getElementById(link.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0.1, 0.25, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const className = ['nav', scrolled ? 'is-solid' : '', open ? 'is-open' : ''].filter(Boolean).join(' ')

  return (
    <header className={className}>
      <div className="wrap nav-bar">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <Logo />
          <span>Roast <em>House</em></span>
        </a>
        <nav id="site-nav" className={open ? 'nav-links open' : 'nav-links'} aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              aria-current={active === link.id ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="nav-cart"
            type="button"
            onClick={() => {
              setOpen(false)
              onCart()
            }}
            aria-label={`Open order, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <span>Order</span>
            {count > 0 && <span className="count">{count}</span>}
          </button>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="burger" data-open={open ? 'true' : 'false'} />
          </button>
        </div>
      </div>
    </header>
  )
}
