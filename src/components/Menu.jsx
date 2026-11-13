import { useMemo, useState } from 'react'
import { buildLine, categories, menuItems, money } from '../data'

function Options({ item, selected, onSize, onMilk }) {
  const showSize = (item.sizes?.length || 0) > 1
  const showMilk = selected.milks.length > 1
  if (!showSize && !showMilk) return null
  return (
    <div className="menu-options">
      {showSize && (
        <div className="seg" role="group" aria-label={`${item.name} size`}>
          {item.sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              aria-pressed={selected.size?.id === size.id}
              onClick={() => onSize(item.id, size.id)}
            >
              {size.label}
            </button>
          ))}
        </div>
      )}
      {showMilk && (
        <div className="seg" role="group" aria-label={`${item.name} milk`}>
          {selected.milks.map((milk) => (
            <button
              key={milk}
              type="button"
              aria-pressed={selected.milk === milk}
              onClick={() => onMilk(item.id, milk)}
            >
              {milk}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function choiceFor(item, choice, dairyFree) {
  const saved = choice[item.id] || {}
  const sizes = item.sizes || []
  const size = sizes.find((entry) => entry.id === saved.sizeId) || sizes.find((entry) => entry.default) || sizes[0] || null
  let milks = item.milkOptions ? [...item.milkOptions] : []
  if (dairyFree) milks = milks.filter((milk) => milk !== 'Whole')
  let milk = milks[0] || null
  if (milks.includes(saved.milk)) milk = saved.milk
  else if (item.defaultMilk && milks.includes(item.defaultMilk)) milk = item.defaultMilk
  return {
    size,
    milk,
    milks,
    price: size ? size.price : item.price,
  }
}

export default function Menu({ cart, pickupName, onAdd, onChangePickup }) {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [dairyFree, setDairyFree] = useState(false)
  const [choice, setChoice] = useState({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menuItems.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (dairyFree && !item.dairyFree && !(item.milkOptions || []).some((milk) => milk !== 'Whole')) return false
      if (!q) return true
      return `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(q)
    })
  }, [category, dairyFree, query])

  const feature = filtered.find((item) => item.featured)
  const rows = filtered.filter((item) => !item.featured)

  function setSize(id, sizeId) {
    setChoice((prev) => ({ ...prev, [id]: { ...prev[id], sizeId } }))
  }

  function setMilk(id, milk) {
    setChoice((prev) => ({ ...prev, [id]: { ...prev[id], milk } }))
  }

  function add(item) {
    const selected = choiceFor(item, choice, dairyFree)
    onAdd(buildLine(item, { size: selected.size, milk: selected.milk }))
  }

  function reset() {
    setCategory('All')
    setQuery('')
    setDairyFree(false)
  }

  return (
    <section className="section section-menu" id="menu">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">02 — The menu</p>
          <h2>From the bar and the case.</h2>
          <p className="sub">
            Choose a size and a milk, then add it to a pickup order. You can change the café before you check out.
          </p>
        </header>

        <div className="pickup-banner">
          <p>
            Picking up at <strong>{pickupName}</strong>
          </p>
          <button className="text-btn" type="button" onClick={onChangePickup}>
            Change café
          </button>
        </div>

        <div className="menu-tools">
          <div className="menu-tools-row">
            <div className="cats" role="toolbar" aria-label="Menu categories">
              {categories.map((name) => (
                <button
                  key={name}
                  className="chip"
                  type="button"
                  aria-pressed={category === name}
                  onClick={() => setCategory(name)}
                >
                  {name}
                </button>
              ))}
              <button className="chip" type="button" aria-pressed={dairyFree} onClick={() => setDairyFree((value) => !value)}>
                Dairy-free
              </button>
            </div>
            <label className="search">
              <span className="sr-only">Search the menu</span>
              <input
                type="search"
                placeholder="Search the menu"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          <p className="result-count" aria-live="polite">
            {filtered.length} on the menu
          </p>
        </div>

        {feature && (
          <article className="feature">
            <img src={feature.image} alt="A cortado with leaf latte art and a dusting of spice on a wooden table." />
            <div className="feature-copy">
              {feature.badge && <span className="badge">{feature.badge}</span>}
              <h3 id="feature-title">{feature.name}</h3>
              <p>{feature.description}</p>
              <Options
                item={feature}
                selected={choiceFor(feature, choice, dairyFree)}
                onSize={setSize}
                onMilk={setMilk}
              />
              <div className="feature-actions">
                <button className="btn btn-primary" type="button" onClick={() => add(feature)}>
                  Add to order · {money(choiceFor(feature, choice, dairyFree).price)}
                </button>
                <InOrder cart={cart} id={feature.id} />
              </div>
            </div>
          </article>
        )}

        {rows.length > 0 && (
          <div className="menu-board">
            {rows.map((item) => {
              const selected = choiceFor(item, choice, dairyFree)
              return (
                <article className="menu-row" key={item.id} aria-labelledby={`item-${item.id}`}>
                  <div className="menu-copy">
                    <div className="menu-title">
                      <h3 id={`item-${item.id}`}>{item.name}</h3>
                      {item.badge && <span className="badge">{item.badge}</span>}
                      <span className="cat-label">{item.category}</span>
                    </div>
                    <p>{item.description}</p>
                    <Options item={item} selected={selected} onSize={setSize} onMilk={setMilk} />
                  </div>
                  <div className="menu-buy">
                    <span className="price">{money(selected.price)}</span>
                    <button className="btn btn-dark btn-sm" type="button" onClick={() => add(item)} aria-label={`Add ${item.name} to order`}>
                      Add
                    </button>
                    <InOrder cart={cart} id={item.id} />
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="empty-block">
            <p>Nothing on the bar matches that.</p>
            <button className="btn btn-line" type="button" onClick={reset}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function InOrder({ cart, id }) {
  const qty = cart.filter((line) => line.productId === id).reduce((sum, line) => sum + line.qty, 0)
  if (!qty) return null
  return <span className="in-order">{qty} in order</span>
}
