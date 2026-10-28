export type Game = {
  id: string
  name: string
  image: string
  owned: boolean // highlighted by the "Owned" legend
  rating?: number // out of 10, half steps; shown when the game is hovered
}

// TODO: the ratings below are placeholders. Replace them with your own.

export const games: Game[] = [
  { id: "Codenames", name: "Codenames", image: "/images/games/codenames.png", owned: false, rating: 7.5 },
  { id: "Quest", name: "Quest", image: "/images/games/quest.png", owned: true, rating: 8 },
  { id: "Catan Cities and Knights", name: "Catan Cities and Knights", image: "/images/games/catan-cities-and-knights.png", owned: true, rating: 8.5 },
  { id: "Avalon", name: "Avalon", image: "/images/games/avalon.png", owned: false, rating: 9 },
  { id: "Take Time", name: "Take Time", image: "/images/games/take-time.png", owned: false, rating: 7.5 },
  { id: "Flip 7", name: "Flip 7", image: "/images/games/flip-7.png", owned: true, rating: 8 },
  { id: "Heat: Pedal to the Metal", name: "Heat: Pedal to the Metal", image: "/images/games/heat-pedal-to-the-metal.png", owned: false, rating: 9 },
  { id: "Monopoly Deal", name: "Monopoly Deal", image: "/images/games/monopoly-deal.png", owned: true, rating: 7 },
  { id: "Catan", name: "Catan", image: "/images/games/catan.png", owned: true, rating: 7.5 },
  { id: "Ticket to Ride: Europe", name: "Ticket to Ride: Europe", image: "/images/games/ticket-to-ride-europe.png", owned: true, rating: 8 },
  { id: "Blood on the Clocktower", name: "Blood on the Clocktower", image: "/images/games/blood-on-the-clocktower.png", owned: false, rating: 9.5 },
  { id: "Duel for Cardia", name: "Duel for Cardia", image: "/images/games/duel-for-cardia.png", owned: true, rating: 8.5 },
]