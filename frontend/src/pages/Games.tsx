import { useState } from 'react'
import { Link } from 'react-router'
import Page from '../components/Page'
import Stars from '../components/Stars'
import { games, type Game } from '../data/games'
import { sessions } from '../data/sessions'

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

// Gallery tags are lowercase game names, so that's how sessions name a game.
const tagFor = (game: Game) => game.name.toLowerCase()

// How many game nights each game was played at, and the earliest one.
const plays = new Map(
  games.map((game) => {
    const dates = sessions.filter((s) => s.tags.includes(tagFor(game))).map((s) => s.date)
    return [game.id, { count: dates.length, first: dates.sort()[0] }]
  }),
)

const thisYear = String(new Date().getFullYear())
const top3 = new Set(
  games
    .filter((game) => game.rating !== undefined)
    .sort((a, b) => b.rating! - a.rating!)
    .slice(0, 3)
    .map((game) => game.id),
)

// The legend in the top-right corner. Clicking one fades every game that
// doesn't match it; only one can be on at a time.
const FILTERS = [
  { label: 'Owned', hint: 'games I own', dot: 'bg-green', has: (g: Game) => g.owned },
  { label: 'x5', hint: 'played 5 or more times', dot: 'bg-blue', has: (g: Game) => plays.get(g.id)!.count >= 5 },
  { label: 'New', hint: 'first played this year', dot: 'bg-red', has: (g: Game) => plays.get(g.id)!.first?.startsWith(thisYear) ?? false },
  { label: 'Top 3', hint: 'my three highest rated', dot: 'bg-yellow', has: (g: Game) => top3.has(g.id) },
]

// Tiny alternating tilts so the rows don't look too tidy.
const TILTS = ['-rotate-1', 'rotate-[0.6deg]', '']

function Games() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number] | null>(null)
  const [hovered, setHovered] = useState<Game | null>(null)

  return (
    <Page>
      <div className="absolute top-5 right-6 flex flex-col items-start gap-0.5">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            title={f.hint}
            aria-pressed={filter === f}
            onClick={() => setFilter(filter === f ? null : f)}
            className="flex cursor-pointer items-center gap-1.5 px-1.5 py-0.5 text-[1.05rem] text-pencil transition-colors hover:text-ink aria-pressed:text-ink"
          >
            <span
              className={`size-2.5 rounded-full border border-ink/60 ${f.dot} ${filter === f ? 'ring-[1.5px] ring-ink ring-offset-2 ring-offset-paper' : ''}`}
            />
            {f.label}
          </button>
        ))}
      </div>

      <RatingCard game={hovered} />

      {/* Hovering a game fades the others and lifts it. Leaving the whole
          block (not each game) clears the card, so it doesn't flicker
          while moving between games. */}
      <div className="group/rows mt-6 flex flex-col gap-3" onMouseLeave={() => setHovered(null)}>
        {toRows(games).map((row) => (
          <div key={row[0].id} className="flex items-end justify-center gap-3">
            {row.map((game, i) => {
              const dimmed = filter !== null && !filter.has(game)
              return (
                // Opens the Gallery filtered to this game.
                <Link
                  key={game.id}
                  to={`/gallery?${new URLSearchParams({ tag: tagFor(game) })}`}
                  onMouseEnter={() => setHovered(game)}
                  onFocus={() => setHovered(game)}
                  onBlur={() => setHovered(null)}
                  className={`relative transition duration-200 outline-none hover:z-10 hover:-translate-y-2.5 hover:scale-108 hover:-rotate-2 focus-visible:z-10 focus-visible:-translate-y-2.5 focus-visible:scale-108 ${TILTS[i % TILTS.length]} ${dimmed ? 'opacity-25 grayscale' : 'group-hover/rows:not-hover:opacity-55'}`}
                >
                  <img
                    src={game.image}
                    alt={game.name}
                    className="h-[130px] w-auto drop-shadow-[0_6px_6px_rgb(21_21_21/0.25)]"
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

// The space above the games: shows the hovered game's name and rating, or a
// hint when nothing is hovered. Fixed height so the games never jump.
function RatingCard({ game }: { game: Game | null }) {
  return (
    <div aria-live="polite" className="flex h-24 flex-col items-center justify-center">
      {game ? (
        // Keyed by game so the entrance animation replays on each change.
        <div key={game.id} className="flex animate-scribble-in flex-col items-center gap-2">
          <h2 className="relative text-4xl/none">
            {game.name}
            <span className="wavy-line absolute inset-x-0 -bottom-1.5 h-1.5 bg-blue/70" />
          </h2>
          {game.rating === undefined ? (
            <p className="text-pencil">not rated yet</p>
          ) : (
            <div className="flex items-center gap-3">
              <Stars rating={game.rating} />
              <p className="text-pencil">
                <span className="text-2xl text-ink">{game.rating}</span> / 10
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="animate-scribble-in text-pencil"></p>
      )}
    </div>
  )
}

export default Games
