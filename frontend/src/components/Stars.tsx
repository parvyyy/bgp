// Five hand-drawn stars for a rating out of 10 (so each star is 2 points).
// Every star is outlined in pencil; the filled part is the same star drawn
// in yellow and clipped to how much of that star is earned, so half stars work.
const STAR = 'M12 1.8 L14.7 8.2 L21.6 9.2 L16.4 13.5 L18.1 20.3 L12 16.6 L5.9 20.1 L7.7 13.3 L2.4 9 L9.3 8.3 Z'

// Small per-star wobble so they don't look stamped.
const TILTS = ['-rotate-6', 'rotate-3', '-rotate-2', 'rotate-6', '-rotate-3']

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} out of 10`}>
      {TILTS.map((tilt, i) => {
        const fill = Math.min(1, Math.max(0, rating / 2 - i)) // how much of this star is filled, 0 to 1
        return (
          <span key={i} className={`relative size-7 ${tilt}`}>
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 24 24" className="size-7 fill-yellow" aria-hidden="true">
                <path d={STAR} />
              </svg>
            </span>
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 size-7 fill-none stroke-ink"
              strokeWidth={1.8}
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={STAR} />
            </svg>
          </span>
        )
      })}
    </div>
  )
}

export default Stars
