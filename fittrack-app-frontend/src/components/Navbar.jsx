import React from 'react'
import { useNavigate, useLocation } from 'react-router'

const Navbar = ({ variant = 'landing', onLogin, onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${location.pathname === path
      ? 'text-primary bg-primary/10'
      : 'text-muted hover:text-white hover:bg-white/5'
    }`

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-bg/70 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-bg">
            F
          </div>
          <span className="text-lg font-bold tracking-tight">
            FitTrack <span className="text-primary">AI</span>
          </span>
        </div>

        {/* Nav links — only when logged in */}
        {variant === 'app' && (
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => navigate('/activities')} className={linkClass('/activities')}>
              Dashboard
            </button>
            <button onClick={() => navigate('/goals')} className={linkClass('/goals')}>
              Goals
            </button>
            <button onClick={() => navigate('/coach')} className={linkClass('/coach')}>
              AI Coach
            </button>
            <button onClick={() => navigate('/adaptive-plan')}
              className={linkClass('/adaptive-plan')}
            >
              Adaptive Plan
            </button>
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {variant === 'landing' ? (
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-lg bg-primary text-bg font-semibold text-sm hover:bg-primary/90 transition shadow-glow"
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-white hover:border-white/30 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar