import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer border-t border-emerald-100/80 bg-white/90 mt-auto">
      <div className="footer-bottom text-center py-8 px-4 max-w-4xl mx-auto">
        <p className="font-bold text-lg text-[#2d5a27]">
          &copy; {new Date().getFullYear()} V-HEALT — Medicina natural
        </p>
        <p className="disclaimer italic text-amber-900/80 mt-2 text-sm max-w-2xl mx-auto">
          Información educativa. Consulta a un profesional de la salud antes de usar cualquier
          tratamiento a base de plantas.
        </p>
      </div>
    </footer>
  );
}
