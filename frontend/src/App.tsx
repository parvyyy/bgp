import { BrowserRouter, Link, Navigate, NavLink, Route, Routes } from 'react-router'
import Home from './pages/Home'
import Games from './pages/Games'
import Gallery from './pages/Gallery'
import Sketch from './components/Sketch'

function App() {
  return (
    <BrowserRouter>
      <header className="relative flex items-center px-6 py-5">
        <Link to="/" className="text-3xl font-bold">
          P
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

// A sketched nav button; the current page gets an accent fill.
function NavItem({ to, children }: { to: string; children: string }) {
  return (
    <NavLink
      to={to}
      className="relative isolate px-4.5 pt-1.5 pb-1 text-[1.375rem] transition-transform hover:scale-103 hover:-rotate-[1.2deg] aria-[current=page]:text-paper"
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
