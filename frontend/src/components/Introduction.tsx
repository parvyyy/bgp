import { useEffect, useState } from 'react'

// Three frames of me waving (transparent PNGs), shown one after another.
const FRAMES = ['/images/me/wave-1.png', '/images/me/wave-2.png', '/images/me/wave-3.png']
const FRAME_MS = 300 // how long each frame stays up

// A hello at the top of the page, as wide as the connect four board
// (7 columns of 60px) so the two line up.
function Introduction() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), FRAME_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-row w-[420px] items-center gap-6">
      <div className="relative size-36 shrink-0">
        {/* All frames are stacked and only the current one is visible, so
            they're all loaded up front and switching never flickers. */}
        {FRAMES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? 'Me, waving' : ''}
            aria-hidden={i !== 0}
            className={`absolute inset-0 size-full object-contain ${i === frame ? '' : 'invisible'}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold">hi</h1>
        <p className="text-xl mt-2 text-pencil">just a fun, silly website for my board games</p>
      </div>
    </div>
  )
}

export default Introduction
