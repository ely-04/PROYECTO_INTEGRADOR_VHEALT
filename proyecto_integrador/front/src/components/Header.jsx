import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const authLink = `/auth?returnTo=${encodeURIComponent(location.pathname + location.search)}`;

  return (
    <header className="header sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md animate-fade-in transition-all duration-500 border-b border-emerald-100/80">
      <div className="container flex items-center justify-between py-3 px-6 max-w-7xl mx-auto">
        <Link to="/" className="logo flex items-center gap-2 no-underline">
          <h1 className="text-3xl font-extrabold text-[#2d5a27] font-serif tracking-tight m-0">
            V-HEALT
          </h1>
        </Link>
        <nav className="nav flex flex-wrap gap-4 sm:gap-6 items-center justify-end">
          <Link
            to="/"
            className="nav-link text-[#5c4a3a] font-semibold hover:text-[#2d5a27] transition-colors duration-200"
          >
            Inicio
          </Link>
          <Link
            to="/plantas"
            className="nav-link text-[#5c4a3a] font-semibold hover:text-[#2d5a27] transition-colors duration-200"
          >
            Plantas
          </Link>
          <Link
            to="/enfermedades"
            className="nav-link text-[#5c4a3a] font-semibold hover:text-[#2d5a27] transition-colors duration-200"
          >
            Enfermedades
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-medium text-[#2d5a27] max-w-[140px] truncate">
                {user?.fullName}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[#2d5a27] text-white hover:bg-[#1e3e1a] transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to={authLink}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-50 text-[#2d5a27] border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
