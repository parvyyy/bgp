import { BrowserRouter, Link, Navigate, NavLink, Route, Routes } from 'react-router'
import Home from './pages/Home'
import Games from './pages/Games'
import Gallery from './pages/Gallery'
import Sketch from './components/Sketch'

function App() {
  return (
    <BrowserRouter>
      <header className="relative flex items-center px-6 py-5">
        {/* Square logo: drop an image at public/images/logo.png. Until then
            it's an empty hand-cut square. */}
        <Link
          to="/"
          aria-label="Home"
          className="rounded-wobbly block size-12 overflow-hidden border-[2.6px] border-ink bg-card transition-transform hover:scale-105 hover:-rotate-3"
        >
          <img src="/images/logo.png" alt="" className="size-full object-cover" onError={(e) => (e.currentTarget.hidden = true)} />
        </Link>
        <nav className="ml-auto flex gap-7">
          <NavItem to="/games">Games</NavItem>
          <NavItem to="/gallery">Gallery</NavItem>
        </nav>
        <span className="wavy-line absolute inset-x-0 bottom-0 h-2 bg-ink" />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

type NavItemProps = {
  to: string
  children: React.ReactNode
}

function NavItem({ to, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className="relative isolate px-6 py-2 text-2xl transition-transform hover:scale-105 hover:-rotate-2"
    >
      {({ isActive }) => (
        <>
          <Sketch filled={isActive} />
          {children}
        </>
      )}
    </NavLink>
  )
}

export default App
