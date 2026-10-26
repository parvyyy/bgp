import { useEffect, useState } from 'react'

const TYPE_MS = 60
const DELETE_MS = 60
const HOLD_MS = 6000

// Shows a fixed `prefix`, then types each phrase after it, holds it,
// deletes it, and moves to the next.
function Typewriter({ prefix, phrases }: { prefix: string; phrases: string[] }) {
  const [index, setIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const phrase = phrases[index % phrases.length]

  useEffect(() => {
    let delay = deleting ? DELETE_MS : TYPE_MS
    let next = () => setLength(length + (deleting ? -1 : 1))

    if (!deleting && length === phrase.length) {
      delay = HOLD_MS
      next = () => setDeleting(true)
    } else if (deleting && length === 0) {
      next = () => {
        setDeleting(false)
        setIndex(index + 1)
      }
    }

    const timer = setTimeout(next, delay)
    return () => clearTimeout(timer)
  }, [phrase, length, deleting, index])

  return (
    <p className="mt-5 mb-12 text-[2rem] font-bold">
      {prefix}
      <span className="text-accent">{phrase.slice(0, length)}</span>
      <span className="ml-0.5 inline-block h-[1.1em] w-0.5 animate-blink bg-ink align-[-0.15em]" aria-hidden="true" />
    </p>
  )
}

export default Typewriter
