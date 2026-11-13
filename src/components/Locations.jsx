import { locations } from '../data'

export default function Locations({ activeId, onSelect, onOrder }) {
  const active = locations.find((place) => place.id === activeId) || locations[0]

  return (
    <section className="section section-locations" id="locations">
      <div className="wrap">
        <header className="section-head">
          <p className="eyebrow">05 — The cafés</p>
          <h2>Three rooms, one roast.</h2>
          <p className="sub">Choose a café for pickup. Hours below are the hours we hold an order.</p>
        </header>
        <div className="loc-layout">
          <div className="loc-rail" role="listbox" aria-label="Cafés">
            {locations.map((place, index) => (
              <button
                key={place.id}
                type="button"
                className="loc-btn"
                role="option"
                aria-selected={place.id === active.id}
                onClick={() => onSelect(place.id)}
              >
                <span className="loc-index">0{index + 1}</span>
                <span>
                  <strong>{place.name}</strong>
                  <small>{place.city}</small>
                </span>
              </button>
            ))}
          </div>
          <article className="loc-detail">
            <img src={active.image} alt={active.imageAlt} />
            <div className="loc-copy">
              <p className="eyebrow">{active.city}</p>
              <h3>{active.name}</h3>
              <p>{active.blurb}</p>
              <p className="address">
                {active.address}
                <br />
                {active.region}
              </p>
              <p>
                <a className="phone-link" href={`tel:${active.tel}`}>
                  {active.phone}
                </a>
                <br />
                <a className="phone-link" href={`mailto:${active.email}`}>
                  {active.email}
                </a>
              </p>
              <dl className="hours">
                {active.hours.map(([days, time]) => (
                  <div key={days}>
                    <dt>{days}</dt>
                    <dd>{time}</dd>
                  </div>
                ))}
              </dl>
              <ul className="notes">
                {active.amenities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="loc-actions">
                <button className="btn btn-primary" type="button" onClick={() => onOrder(active.id)}>
                  Order pickup here
                </button>
                <a className="btn btn-line" href={active.map} target="_blank" rel="noreferrer">
                  Map
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
