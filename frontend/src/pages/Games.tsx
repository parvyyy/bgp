import { useState } from 'react'
import { Link } from 'react-router'
import Page from '../components/Page'
import { games, type Game } from '../data/games'

// Row lengths that outline a circle. Rows fill from the top, so until there
// are enough games the circle is just unfinished; after a full circle the
// pattern starts again.
const ROW_SIZES = [3, 5, 7, 5, 3]

function toRows(items: Game[]): Game[][] {
  const rows: Game[][] = []
  for (let start = 0, i = 0; start < items.length; i++) {
    const size = ROW_SIZES[i % ROW_SIZES.length]
    rows.push(items.slice(start, start + size))
    start += size
  }
  return rows
}

// Tiny alternating tilts so the rows don't look too tidy.
const TILTS = ['-rotate-1', 'rotate-[0.6deg]', '']

function Games() {
  const [showOwned, setShowOwned] = useState(false)

  return (
    <Page>
      {/* Legend in the top-right corner; click to highlight owned games. */}
      <button
        type="button"
        aria-pressed={showOwned}
        onClick={() => setShowOwned(!showOwned)}
        className="absolute top-5 right-6 flex cursor-pointer items-center gap-1.5 px-1.5 py-0.5 text-[1.05rem] text-pencil transition-colors hover:text-ink aria-pressed:text-ink"
      >
        <span
          className={`size-2.5 rounded-full bg-green ${showOwned ? 'ring-[1.5px] ring-ink ring-offset-2 ring-offset-paper' : ''}`}
        />
        Owned
      </button>

      {/* Hovering a game fades the others and lifts it. */}
      <div className="group/rows mt-8 flex flex-col gap-3">
        {toRows(games).map((row) => (
          <div key={row[0].id} className="flex items-end justify-center gap-3">
            {row.map((game, i) => {
              const dimmed = showOwned && !game.owned
              return (
                // Opens the Gallery filtered to this game (tags are lowercase).
                <Link
                  key={game.id}
                  to={`/gallery?${new URLSearchParams({ tag: game.name.toLowerCase() })}`}
                  className={`relative transition duration-200 outline-none hover:z-10 hover:-translate-y-2.5 hover:scale-108 hover:-rotate-2 focus-visible:z-10 focus-visible:-translate-y-2.5 focus-visible:scale-108 ${TILTS[i % TILTS.length]} ${dimmed ? 'opacity-25 grayscale' : 'group-hover/rows:not-hover:opacity-55'}`}
                >
                  <img
                    src={game.image}
                    alt={game.name}
                    className="h-[130px] w-auto drop-shadow-[0_6px_6px_rgb(0_0_0/0.25)]"
                  />
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </Page>
  )
}

export default Games
