import { Link } from 'react-router-dom'

function Navbar({ onGoToToday }) {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={onGoToToday}
          className="flex items-center"
        >
          <img
            src="/logo_taskflow.png"
            alt="TaskFlow"
            className="h-14 w-auto"
          />
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={onGoToToday}
            className="font-medium text-slate-700 transition hover:text-blue-600"
          >
            Ma semaine
          </Link>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }}
            className="font-medium text-slate-700 transition hover:text-red-600"
          >
            Déconnexion
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar