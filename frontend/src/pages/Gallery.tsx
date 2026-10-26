import { useSearchParams } from 'react-router'
import { sessions } from '../data/sessions'
import Page from '../components/Page'
import PhotoSlider from '../components/PhotoSlider'
import TagSearch from '../components/TagSearch'

// Turns "2026-10-24" into "24 Oct 2026".
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Every tag used in any session, most used first.
function allTags() {
  const counts = new Map<string, number>()
  for (const tag of sessions.flatMap((session) => session.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!)
}

const tags = allTags()

// Each card is a polaroid taped to the page. Tilts repeat every 4 cards and
// tape positions every 5, so neither lines up with the grid's 3 columns.
const TILTS = ['-rotate-[1.4deg]', 'rotate-1', '-rotate-[0.4deg]', 'rotate-[1.6deg]']
const TAPES = [
  '-top-3.5 left-[calc(50%-45px)] -rotate-3',
  'top-1 -left-4.5 -rotate-[38deg]',
  '-top-3.5 left-[calc(50%-45px)] rotate-[4deg]',
  'top-1 -right-4.5 rotate-[36deg]',
  '-top-3.5 left-[calc(50%-45px)] -rotate-3',
]

function Gallery() {
  // The filter lives in the URL (?tag=azul&tag=wingspan), so it can be
  // linked to, e.g. from the Games page.
  const [params, setParams] = useSearchParams()
  const selected = params.getAll('tag')
  const setSelected = (tags: string[]) =>
    setParams({ tag: tags }, { replace: true })
  const shown = sessions.filter((session) => selected.every((tag) => session.tags.includes(tag)))

  return (
    <Page>
      <div className="mb-10 flex items-center justify-between text-left">
        <p className="text-pencil">
          {shown.length === sessions.length
            ? `${sessions.length} game nights`
            : `${shown.length} of ${sessions.length} game nights`}
        </p>
        <TagSearch tags={tags} selected={selected} onChange={setSelected} />
      </div>

      {shown.length === 0 && <p className="mb-8 text-pencil">No game nights with all of those tags.</p>}

      <div className="grid grid-cols-3 gap-10 text-left">
        {shown.map((session, i) => (
          <article
            key={session.id}
            className={`rounded-wobbly relative border-[2.6px] border-ink bg-card px-3.5 pt-3.5 pb-5 shadow-[3px_4px_0_rgb(0_0_0/0.08)] transition hover:scale-102 hover:rotate-0 ${TILTS[i % TILTS.length]}`}
          >
            <span className={`torn absolute z-10 h-[26px] w-[90px] bg-yellow/50 ${TAPES[i % TAPES.length]}`} />

            <PhotoSlider photos={session.photos} alt={`Game night, ${formatDate(session.date)}`}>
              <time className="absolute bottom-2 left-2 rounded bg-ink px-2 pt-0.5 text-[0.95rem] text-paper">
                {formatDate(session.date)}
              </time>
            </PhotoSlider>

            {/* Only one line of tags: any that don't fit wrap out of sight. */}
            <ul className="mt-3.5 flex h-6 flex-wrap gap-1.5 overflow-hidden">
              {session.tags.map((tag) => (
                <li
                  key={tag}
                  className="h-6 rounded-[5px_7px_4px_6px] bg-slate-400 px-2.5 pt-[0.2rem] text-[0.95rem]/[1.3] whitespace-nowrap text-paper"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Page>
  )
}

export default Gallery
