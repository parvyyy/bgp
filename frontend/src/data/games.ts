// Your board game collection.
// Put game images (PNGs with transparent backgrounds) in `public/images/games/`
// and reference them here by path.

export type Game = {
  id: string
  name: string
  image: string
  owned: boolean // highlighted by the "Owned" legend
}

export const games: Game[] = [
  { id: 'catan', name: 'Catan', image: '/images/games/catan.png', owned: true },
  { id: 'wingspan', name: 'Wingspan', image: '/images/games/wingspan.png', owned: false },
  { id: 'azul', name: 'Azul', image: '/images/games/azul.png', owned: true },
  { id: 'terraforming-mars', name: 'Terraforming Mars', image: '/images/games/terraforming-mars.png', owned: false },
  { id: 'ticket-to-ride', name: 'Ticket to Ride', image: '/images/games/ticket-to-ride.png', owned: true },
  { id: 'carcassonne', name: 'Carcassonne', image: '/images/games/carcassonne.png', owned: false },
  { id: 'codenames', name: 'Codenames', image: '/images/games/codenames.png', owned: true },
]
