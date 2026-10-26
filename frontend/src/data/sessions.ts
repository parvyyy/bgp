// One entry per gaming session. Newest first.
// Put photos in `public/images/gallery/` and reference them here by path.
// A session can have several photos; the first is shown by default.

export type Session = {
  id: string
  date: string // YYYY-MM-DD
  photos: string[]
  tags: string[]
}

export const sessions: Session[] = [
  { id: '2026-10-24', date: '2026-10-24', photos: ['/images/gallery/placeholder.svg', '/images/gallery/placeholder-2.svg', '/images/gallery/placeholder-3.svg'], tags: ['terraforming mars', '4 players', 'marathon'] },
  { id: '2026-10-17', date: '2026-10-17', photos: ['/images/gallery/placeholder.svg'], tags: ['azul', 'codenames', 'casual'] },
  { id: '2026-10-10', date: '2026-10-10', photos: ['/images/gallery/placeholder.svg', '/images/gallery/placeholder-2.svg'], tags: ['root', 'first play'] },
  { id: '2026-10-03', date: '2026-10-03', photos: ['/images/gallery/placeholder.svg'], tags: ['wingspan', '2 players'] },
  { id: '2026-09-26', date: '2026-09-26', photos: ['/images/gallery/placeholder.svg'], tags: ['catan', 'rematch'] },
  { id: '2026-09-19', date: '2026-09-19', photos: ['/images/gallery/placeholder.svg'], tags: ['ticket to ride', 'family night'] },
  { id: '2026-09-12', date: '2026-09-12', photos: ['/images/gallery/placeholder.svg'], tags: ['carcassonne', 'close game'] },
  { id: '2026-09-05', date: '2026-09-05', photos: ['/images/gallery/placeholder.svg'], tags: ['codenames', '8 players', 'party'] },
  { id: '2026-08-29', date: '2026-08-29', photos: ['/images/gallery/placeholder.svg'], tags: ['azul', 'wingspan', 'double header'] },
]
