import { buildLine, money } from '../data'

export default function Hero({ featured, onAdd }) {
  return (
    <section className="hero" id="top">
      <img
        className="hero-img"
        src="/images/people.jpg"
        alt="Interior of a specialty café with long wooden tables, pendant lights, and the bar in the distance."
        fetchPriority="high"
      />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Est. 2014 · Direct-trade roastery</p>
          <h1>
            Roast
            <br />
            <em>House</em>
          </h1>
          <p className="hero-lede">
            Seasonal coffees from farms we visit, roasted in twelve-kilogram batches and brewed to order in Bengaluru, Mumbai, and Delhi.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#menu">
              Explore the menu
            </a>
            <a className="btn btn-ghost" href="#story">
              Our story
            </a>
          </div>
          <dl className="hero-stats">
            <div>
              <dt>Partner farms</dt>
              <dd>14</dd>
            </div>
            <div>
              <dt>Roast batch</dt>
              <dd>12 kg</dd>
            </div>
            <div>
              <dt>Cafés</dt>
              <dd>3</dd>
            </div>
          </dl>
        </div>
        {featured && (
          <aside className="hero-card">
            <p className="eyebrow">On the bar this week</p>
            <h2>{featured.name}</h2>
            <p>{featured.description}</p>
            <button className="btn btn-primary" type="button" onClick={() => onAdd(buildLine(featured))}>
              Add · {money(featured.price)}
            </button>
          </aside>
        )}
      </div>
    </section>
  )
}
