import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="page-placeholder max-w-lg mx-auto text-center py-16 px-4">
        <h2 className="text-2xl font-bold text-[#2d5a27] mb-4">Inicia sesión</h2>
        <p className="text-gray-600 mb-6">Necesitas una cuenta para ver tu panel.</p>
        <Link to="/auth" className="inline-block px-6 py-2 rounded-lg bg-[#2d5a27] text-white font-semibold">
          Ir a login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/80 shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#2d5a27] mb-2">Hola, {user?.fullName}</h2>
        <p className="text-gray-600 mb-6">{user?.email}</p>
        <p className="text-gray-700 leading-relaxed">
          Aquí puedes ampliar el panel con historial del chatbot, favoritos de plantas o preferencias.
          Mientras tanto, explora las secciones de plantas y enfermedades.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            to="/plantas"
            className="px-4 py-2 rounded-lg bg-[#2d5a27] text-white text-sm font-semibold hover:bg-[#1e3e1a]"
          >
            Plantas medicinales
          </Link>
          <Link
            to="/enfermedades"
            className="px-4 py-2 rounded-lg border-2 border-[#2d5a27] text-[#2d5a27] text-sm font-semibold hover:bg-emerald-50"
          >
            Enfermedades
          </Link>
        </div>
      </div>
    </div>
  );
}
