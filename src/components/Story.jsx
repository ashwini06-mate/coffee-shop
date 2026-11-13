const steps = [
  {
    n: '01',
    title: 'Visit',
    copy: 'We cup at origin and pay a premium the same season. The price we paid is written on the bag.',
  },
  {
    n: '02',
    title: 'Roast',
    copy: 'Twelve-kilogram batches on a drum roaster. If a coffee only tastes sweet when we roast it dark, we don’t buy it.',
  },
  {
    n: '03',
    title: 'Serve',
    copy: 'Dialed in every morning. Espresso is pulled to taste, and filter is brewed to order or held for under an hour.',
  },
]

export default function Story() {
  return (
    <section className="section section-story" id="story">
      <div className="wrap">
        <div className="story-grid">
          <figure className="story-photo">
            <img
              src="/images/story.jpg"
              alt="Eight cups of coffee arranged from above for a tasting flight on a round wooden table."
            />
          </figure>
          <div className="story-copy">
            <header className="section-head">
              <p className="eyebrow">01 — The story</p>
              <h2>A shorter distance from farm to cup.</h2>
            </header>
            <div className="prose">
              <p>
                In 2014 Mara Ellison and Jonah Park came home from a harvest in Huila with a notebook of coffees they could not find in Bengaluru. Roast House started as one twelve-kilogram roaster in a shared kitchen, and a rule: buy only from farms they had stood in.
              </p>
              <p>
                The Indiranagar roastery still runs those small batches. Fourteen producer partners send coffee to Bengaluru. We profile each lot for sweetness, then pour the same beans in Bengaluru, Mumbai, and Delhi.
              </p>
            </div>
            <blockquote>
              <p>The best cup we ever drank was poured by the person who grew it. The work since has been keeping that distance short.</p>
              <footer>— Mara Ellison, co-founder</footer>
            </blockquote>
          </div>
        </div>
        <ul className="stats">
          <li>
            <strong>14</strong>
            <span>partner farms</span>
          </li>
          <li>
            <strong>2014</strong>
            <span>first roast in Bengaluru</span>
          </li>
          <li>
            <strong>3</strong>
            <span>cafés across India</span>
          </li>
        </ul>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.n}>
              <span>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
