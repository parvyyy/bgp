// Hand-drawn tally marks: groups of four upright strokes, crossed out by
// the fifth. Each stroke leans a little so it looks drawn by hand.
const STROKES = ['M6 4 L7 27', 'M13 3 L12.5 26', 'M20 4.5 L20.5 27', 'M27 3 L26 26']
const CROSS = 'M2 22 Q17 15 33 8'

function Tally({ count, className }: { count: number; className: string }) {
  if (count === 0) return <span className="text-pencil">–</span>

  // e.g. 12 -> [5, 5, 2]
  const groups = Array.from({ length: Math.ceil(count / 5) }, (_, g) => Math.min(5, count - g * 5))
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {groups.map((marks, g) => (
        <svg
          key={g}
          viewBox="0 0 35 30"
          aria-hidden="true"
          className={`h-[30px] w-[35px] fill-none ${className}`}
          strokeWidth={2.6}
          strokeLinecap="round"
        >
          {STROKES.slice(0, Math.min(marks, 4)).map((d) => (
            <path key={d} d={d} />
          ))}
          {marks === 5 && <path d={CROSS} />}
        </svg>
      ))}
    </div>
  )
}

export default Tally
