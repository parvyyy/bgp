import { useState, type ReactNode } from 'react'

// A rounded chevron with a soft shadow so it shows up on any photo.
function Chevron({ left = false }: { left?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`size-[30px] fill-none stroke-paper drop-shadow-[0_1px_3px_rgb(0_0_0/0.6)] ${left ? '-scale-x-100' : ''}`}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 4.5 L16.5 12 L9 19.5" />
    </svg>
  )
}

// Each arrow is a clickable strip down one side of the photo. It appears on
// hover, and darkens slightly toward its edge when hovered itself.
const arrow =
  'absolute inset-y-0 flex w-[18%] cursor-pointer items-center justify-center opacity-0 transition group-hover/photo:opacity-80 focus-visible:opacity-80 hover:opacity-100! hover:from-black/15 hover:to-transparent'

// Shows one photo at a time. With more than one photo, dots in the top-left
// show which one you're on, and arrows let you step through them (no
// wrapping around at the ends). `children` are drawn on top, e.g. a label.
function PhotoSlider({ photos, alt, children }: { photos: string[]; alt: string; children?: ReactNode }) {
  const [index, setIndex] = useState(0)
  const many = photos.length > 1

  return (
    <div className="group/photo relative">
      <img
        src={photos[index]}
        alt={many ? `${alt} (photo ${index + 1} of ${photos.length})` : alt}
        className="aspect-4/3 w-full rounded border-[1.8px] border-ink object-cover"
      />
      {children}

      {many && (
        <div className="absolute top-2 left-2 flex gap-1 rounded bg-paper/60 px-[5px] py-1" aria-hidden="true">
          {photos.map((_, i) => (
            <span key={i} className={`size-1.5 rounded-full border border-pencil ${i === index ? 'bg-pencil' : ''}`} />
          ))}
        </div>
      )}
      {index > 0 && (
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => setIndex(index - 1)}
          className={`${arrow} left-0 rounded-l hover:bg-linear-to-r`}
        >
          <Chevron left />
        </button>
      )}
      {index < photos.length - 1 && (
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => setIndex(index + 1)}
          className={`${arrow} right-0 rounded-r hover:bg-linear-to-l`}
        >
          <Chevron />
        </button>
      )}
    </div>
  )
}

export default PhotoSlider
