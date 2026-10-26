// Draws a hand-sketched box (four pencil strokes that overshoot the corners)
// behind its parent, like the buttons on strategyjam.org.
// The parent needs `relative isolate` so the drawing sits behind its text.
function Sketch({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-10 size-full overflow-visible"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {filled && <path className="fill-blue/50" d="M5 4 L95 7 L96 34 L4 36 Z" />}
      <path
        className="fill-none stroke-ink"
        strokeWidth={2.6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke" // line stays the same width when stretched
        d="M-3 3.3 Q50 4 103 5.3 M96 -3 Q95.6 18.6 97 43 M101 37.2 Q50 36.6 -4 36.8 M3.5 43 Q3 19.2 4.5 -2.3"
      />
    </svg>
  )
}

export default Sketch
