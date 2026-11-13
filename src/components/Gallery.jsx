import { useEffect, useMemo, useState } from 'react'
import { buildLine, gallery, galleryFilters, money, products, roastFilters } from '../data'
import useScrollLock from '../useScrollLock'

export default function Gallery({ onAdd }) {
  const [photoFilter, setPhotoFilter] = useState('All')
  const [roast, setRoast] = useState('All')
  const [photoIndex, setPhotoIndex] = useState(null)

  const photos = useMemo(
    () => gallery.filter((item) => photoFilter === 'All' || item.category === photoFilter),
    [photoFilter],
  )
  const bags = useMemo(
    () => products.filter((item) => roast === 'All' || item.roast === roast),
    [roast],
  )

  const active = photoIndex === null ? null : photos[photoIndex]
  useScrollLock(active !== null)

  useEffect(() => {
    if (photoIndex === null) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setPhotoIndex(null)
      if (event.key === 'ArrowRight') setPhotoIndex((index) => (index + 1) % photos.length)
      if (event.key === 'ArrowLeft') setPhotoIndex((index) => (index - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photoIndex, photos.length])

  function openPhoto(index) {
    setPhotoIndex(index)
  }

  return (
    <>
      <section className="section section-dark" id="gallery">
        <div className="wrap">
          <header className="section-head">
            <p className="eyebrow">03 — The gallery</p>
            <h2>The room, the roast, the cup.</h2>
            <p className="sub">A look inside the cafés and the roastery. Open any frame for a closer view.</p>
          </header>
          <div className="cats" role="toolbar" aria-label="Gallery filters">
            {galleryFilters.map((name) => (
              <button
                key={name}
                className="chip chip-light"
                type="button"
                aria-pressed={photoFilter === name}
                onClick={() => {
                  setPhotoFilter(name)
                  setPhotoIndex(null)
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="bento">
            {photos.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`bento-item ${item.layout}`}
                onClick={() => openPhoto(index)}
              >
                <img src={item.src} alt={item.alt} />
                <span className="cap">
                  <small>{item.category}</small>
                  {item.caption}
                </span>
              </button>
            ))}
          </div>
        </div>
        {active && (
          <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.caption} onClick={() => setPhotoIndex(null)}>
            <button className="lightbox-close" type="button" onClick={() => setPhotoIndex(null)}>
              Close
            </button>
            <button
              className="lightbox-nav prev"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setPhotoIndex((index) => (index - 1 + photos.length) % photos.length)
              }}
            >
              Prev
            </button>
            <figure onClick={(event) => event.stopPropagation()}>
              <img src={active.src} alt={active.alt} />
              <figcaption>
                <span>{active.category}</span>
                <strong>{active.caption}</strong>
                <em>
                  {photoIndex + 1} / {photos.length}
                </em>
              </figcaption>
            </figure>
            <button
              className="lightbox-nav next"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setPhotoIndex((index) => (index + 1) % photos.length)
              }}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <section className="section section-paper" id="coffees">
        <div className="wrap">
          <header className="section-head">
            <p className="eyebrow">04 — The coffees</p>
            <h2>Bags from this month’s roast.</h2>
            <p className="sub">
              250-gram bags, roasted in Bengaluru and stocked at all three cafés. Add one to the same pickup order.
            </p>
          </header>
          <div className="cats" role="toolbar" aria-label="Roast filters">
            {roastFilters.map((name) => (
              <button key={name} className="chip" type="button" aria-pressed={roast === name} onClick={() => setRoast(name)}>
                {name}
              </button>
            ))}
          </div>
          {bags.length === 0 ? (
            <p className="empty-block">No coffees in that roast style right now.</p>
          ) : (
            <div className="product-grid">
              {bags.map((product) => (
                <article className="bean" key={product.id}>
                  <div className="bean-visual">
                    <img src={product.image} alt={product.imageAlt} />
                    <div className="bean-tags">
                      <span>{product.origin}</span>
                      <span>{product.roast}</span>
                    </div>
                  </div>
                  <div className="bean-body">
                    <h3>{product.name}</h3>
                    <p className="meta">
                      {product.region} · {product.process} · {product.weight}
                    </p>
                    <ul className="notes">
                      {product.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                    <details>
                      <summary>Producer and brew notes</summary>
                      <p>
                        {product.producer}. {product.varietal}. Grown at {product.elevation}.
                      </p>
                      <p>{product.brew}</p>
                    </details>
                    <div className="bean-row">
                      <strong className="price">{money(product.price)}</strong>
                      <button className="btn btn-dark btn-sm" type="button" onClick={() => onAdd(buildLine(product))}>
                        Add bag
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
