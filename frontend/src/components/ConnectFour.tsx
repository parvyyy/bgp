import { useEffect, useState, type CSSProperties } from 'react'
import Sketch from './Sketch'
import Tally from './Tally'

// Connect four against me (well, a bot playing as me). You're red and go
// first. Wins are counted in score.json (see vite.config.ts) and shown as
// tally marks under the board.

const COLS = 7
const ROWS = 6
const CELL = 60 // px per slot, across and down

type Piece = 'you' | 'me'
type Board = Piece[][] // one stack per column, bottom piece first
type Score = Record<Piece, number>

const STROKE = { you: 'stroke-red', me: 'stroke-blue' }
const FILL = { you: 'fill-red/15', me: 'fill-blue/20' }

// The game is just the list of columns played, in order; you play first.
function toBoard(moves: number[]): Board {
  const board: Board = Array.from({ length: COLS }, () => [])
  moves.forEach((c, i) => board[c].push(i % 2 === 0 ? 'you' : 'me'))
  return board
}

// The four winning slots as [column, row] pairs, or null if nobody has won.
function findWin(board: Board): [number, number][] | null {
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < board[c].length; r++) {
      for (const [dc, dr] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
        const line = [0, 1, 2, 3].map((i): [number, number] => [c + dc * i, r + dr * i])
        if (line.every(([x, y]) => board[x]?.[y] === board[c][r])) return line
      }
    }
  }
  return null
}

// How forgiving I am: I pick any move within SLACK points of the best
// one, and on SLIP_CHANCE of my turns I allow a bit more.
const SLACK = 2
const SLIP_CHANCE = 0.15

// Asks an online solver (connect4.gamesolver.org) to score every column for
// me: positive wins, 0 draws, negative loses, 100 is a full column.
// I then play solidly but not perfectly: I pick at random among the
// near-best moves, and normally never let a won or drawn game slip.
async function myMove(moves: number[]): Promise<number> {
  const response = await fetch(`https://connect4.gamesolver.org/solve?pos=${moves.map((c) => c + 1).join('')}`)
  const { score } = (await response.json()) as { score: number[] }

  const open = score.flatMap((s, c) => (s === 100 ? [] : [{ s, c }]))
  const best = Math.max(...open.map(({ s }) => s))
  const slip = Math.random() < SLIP_CHANCE
  const good = open.filter(
    ({ s }) => s >= best - (slip ? SLACK * 2 : SLACK) && (slip || Math.sign(s) === Math.sign(best)),
  )
  return good[Math.floor(Math.random() * good.length)].c
}

// A pointy-top hexagon filling its box, so it lines up with the isometric dots.
function Hex({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true" className={`size-full overflow-visible ${className}`} style={style}>
      <polygon points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function ConnectFour() {
  const [moves, setMoves] = useState<number[]>([])
  const [score, setScore] = useState<Score | null>(null)
  const [connectError, setConnectError] = useState(false)

  const board = toBoard(moves)
  const win = findWin(board)
  const over = win !== null || moves.length === COLS * ROWS
  const turn: Piece = moves.length % 2 === 0 ? 'you' : 'me'
  const winner = win ? board[win[0][0]][win[0][1]] : null

  // Load the score once.
  useEffect(() => {
    fetch('/api/score')
      .then((response) => response.json())
      .then(setScore)
      .catch(() => {}) // no score file (e.g. on a static host): just hide the tally
  }, [])

  // Count each win once, when it happens.
  useEffect(() => {
    if (!winner) return
    fetch('/api/score', { method: 'POST', body: JSON.stringify({ winner }) })
      .then((response) => response.json())
      .then(setScore)
      .catch(() => {})
  }, [winner])

  // I answer after a short pause (at least 0.6s, so it feels like a turn).
  useEffect(() => {
    if (turn !== 'me' || over) return
    let cancelled = false
    const pause = new Promise((resolve) => setTimeout(resolve, 600))
    Promise.all([myMove(moves), pause])
      .then(([column]) => !cancelled && setMoves([...moves, column]))
      .catch(() => !cancelled && setConnectError(true))
    return () => {
      cancelled = true
    }
  }, [moves, turn, over])

  function restart() {
    setMoves([])
    setConnectError(false)
  }

  let message = turn === 'you' ? 'Your turn' : "My turn..."
  if (connectError) message = "I couldn't connect"
  if (over) message = winner === 'you' ? 'You win!' : winner === 'me' ? 'You lose!' : "It's a draw"
  const shown = over ? winner : turn // whose colour the hex next to the message shows

  return (
    <div>
      <div className="mx-auto w-fit">
        {/* Whose turn it is, tucked in above the board's right edge. */}
        <div className="flex items-center justify-start gap-2 text-2xl font-bold">
          {shown && (
            <span className="size-6">
              <Hex className={`stroke-[3] ${STROKE[shown]} ${FILL[shown]}`} />
            </span>
          )}
          {message}
        </div>
        <div className="mt-1 text-lg text-pencil flex items-center justify-start">
          Turn {moves.length + 1}
        </div>

        {/* The board: one button per column. Pieces stack from the bottom. */}
        <div className="mt-16 flex">
          {board.map((stack, c) => {
            const canDrop = turn === 'you' && !over && stack.length < ROWS
            return (
              <button
                key={c}
                type="button"
                disabled={!canDrop}
                aria-label={`Drop in column ${c + 1}`}
                onClick={() => setMoves([...moves, c])}
                className="group flex cursor-pointer flex-col-reverse outline-none disabled:cursor-default"
              >
                {Array.from({ length: ROWS }, (_, r) => {
                  const piece = stack[r]
                  const winning = win?.some(([x, y]) => x === c && y === r)
                  return (
                    <div key={r} className="relative" style={{ width: CELL, height: CELL }}>
                      {/* Where your piece would land. */}
                      {canDrop && r === stack.length && (
                        <Hex className="absolute inset-[3px] size-auto fill-none stroke-red stroke-2 opacity-0 transition-opacity [stroke-dasharray:5_5] group-hover:opacity-100 group-focus-visible:opacity-100" />
                      )}

                      {piece && (
                        <Hex
                          className={`absolute inset-[3px] size-auto animate-drop stroke-[3.5] ${STROKE[piece]} ${FILL[piece]} ${win && !winning ? 'opacity-35' : ''}`}
                          style={{ '--fall': `${-(ROWS - r + 0.5) * CELL}px` } as CSSProperties}
                        />
                      )}
                    </div>
                  )
                })}

                {/* A faint piece hovering above the column. */}
                <div className="relative" style={{ width: CELL, height: CELL }}>
                  {canDrop && (
                    <Hex className="absolute inset-[3px] size-auto fill-red/15 stroke-red stroke-[3.5] opacity-0 transition-opacity group-hover:opacity-50 group-focus-visible:opacity-50" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
        <span className="wavy-line block h-2 bg-ink" />
      </div>

      <button
          type="button"
          onClick={restart}
          className="relative isolate mt-8 cursor-pointer px-5 pt-1.5 pb-1 text-[1.375rem] transition-transform hover:scale-103 hover:-rotate-[1.2deg]"
        >
          <Sketch />
          {over ? 'Play again' : 'Start over'}
        </button>

      {/* All-time wins, as tally marks. */}
      {score && (
        <div className="mx-auto mt-10 grid w-[420px] grid-cols-[auto_1fr] items-center gap-x-5 gap-y-3 text-left">
          <span className="text-pencil" aria-label={`You: ${score.you} wins`}>
            You
          </span>
          <Tally count={score.you} className="stroke-red" />
          <span className="text-pencil" aria-label={`Me: ${score.me} wins`}>
            Me
          </span>
          <Tally count={score.me} className="stroke-blue" />
        </div>
      )}
    </div>
  )
}

export default ConnectFour
