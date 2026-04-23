import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingParticles = ({ count = 20, type = 'flower', showLeaves = false }) => {
  // Generar partículas con posiciones y velocidades aleatorias
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Posición X en %
      y: Math.random() * 100, // Posición Y en %
      size: Math.random() * 30 + 20, // Tamaño entre 20-50px (más grande)
      duration: Math.random() * 20 + 15, // Duración 15-35s
      delay: Math.random() * 5, // Delay inicial 0-5s
      opacity: Math.random() * 0.4 + 0.2, // Opacidad 0.2-0.6 (más visible)
    }));
  }, [count]);

  // Generar hojas adicionales más pequeñas
  const leaves = useMemo(() => {
    if (!showLeaves) return [];
    return Array.from({ length: Math.floor(count * 0.6) }, (_, i) => ({
      id: `leaf-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 15, // Hojas más grandes 15-35px
      duration: Math.random() * 25 + 20, // Más lentas 20-45s
      delay: Math.random() * 5,
      opacity: Math.random() * 0.45 + 0.25, // Más visible 0.25-0.7
      rotation: Math.random() * 360,
    }));
  }, [count, showLeaves]);

  // Iconos SVG para diferentes tipos de partículas
  const renderParticle = (size, opacity) => {
    switch (type) {
      case 'flower':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            {/* Pétalos en forma de flor */}
            {/* Pétalo superior */}
            <ellipse cx="32" cy="15" rx="8" ry="12" fill={`rgba(255, 182, 193, ${opacity})`} />
            {/* Pétalo derecha superior */}
            <ellipse cx="44" cy="22" rx="8" ry="12" fill={`rgba(255, 182, 193, ${opacity})`} 
              transform="rotate(72 44 22)" />
            {/* Pétalo derecha inferior */}
            <ellipse cx="42" cy="38" rx="8" ry="12" fill={`rgba(255, 192, 203, ${opacity})`} 
              transform="rotate(144 42 38)" />
            {/* Pétalo izquierda inferior */}
            <ellipse cx="22" cy="38" rx="8" ry="12" fill={`rgba(255, 192, 203, ${opacity})`} 
              transform="rotate(-144 22 38)" />
            {/* Pétalo izquierda superior */}
            <ellipse cx="20" cy="22" rx="8" ry="12" fill={`rgba(255, 182, 193, ${opacity})`} 
              transform="rotate(-72 20 22)" />
            {/* Centro de la flor */}
            <circle cx="32" cy="28" r="7" fill={`rgba(255, 215, 0, ${opacity * 1.3})`} />
            <circle cx="32" cy="28" r="4" fill={`rgba(255, 165, 0, ${opacity * 0.8})`} />
          </svg>
        );
      case 'sparkle':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill={`rgba(255, 215, 0, ${opacity})`}
            />
            <path
              d="M17 6L17.5 8L19.5 8.5L17.5 9L17 11L16.5 9L14.5 8.5L16.5 8L17 6Z"
              fill={`rgba(255, 182, 193, ${opacity})`}
            />
          </svg>
        );
      case 'leaf':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            {/* Hoja simple y realista */}
            <path
              d="M32 8 Q48 24 48 40 Q48 52 32 56 Q16 52 16 40 Q16 24 32 8 Z"
              fill={`rgba(152, 223, 178, ${opacity})`}
              stroke={`rgba(76, 175, 80, ${opacity * 1.2})`}
              strokeWidth="1.5"
            />
            {/* Nervadura central */}
            <path
              d="M32 8 L32 56"
              stroke={`rgba(76, 175, 80, ${opacity * 0.8})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Nervaduras laterales */}
            <path
              d="M32 20 Q40 28 44 36"
              stroke={`rgba(76, 175, 80, ${opacity * 0.6})`}
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M32 20 Q24 28 20 36"
              stroke={`rgba(76, 175, 80, ${opacity * 0.6})`}
              strokeWidth="1"
              fill="none"
            />
          </svg>
        );
      case 'circle':
      default:
        return (
          <circle
            r={size / 2}
            fill={`rgba(184, 213, 232, ${opacity})`}
            cx={size / 2}
            cy={size / 2}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Partículas principales (flores) */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            rotate: 0,
          }}
          animate={{
            y: [`${particle.y}vh`, `${particle.y - 120}vh`],
            x: [
              `${particle.x}vw`,
              `${particle.x + Math.sin(particle.id) * 15}vw`,
              `${particle.x}vw`,
            ],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 0.7, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            width: particle.size,
            height: particle.size,
          }}
        >
          {renderParticle(particle.size, particle.opacity)}
        </motion.div>
      ))}

      {/* Hojas pequeñas adicionales */}
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          initial={{
            x: `${leaf.x}vw`,
            y: `${leaf.y}vh`,
            rotate: leaf.rotation,
          }}
          animate={{
            y: [`${leaf.y}vh`, `${leaf.y - 100}vh`],
            x: [
              `${leaf.x}vw`,
              `${leaf.x + Math.sin(parseFloat(leaf.id.split('-')[1])) * 10}vw`,
              `${leaf.x}vw`,
            ],
            rotate: [leaf.rotation, leaf.rotation + 180, leaf.rotation + 360],
            opacity: [leaf.opacity, leaf.opacity * 0.5, leaf.opacity],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            width: leaf.size,
            height: leaf.size,
          }}
        >
          <svg width={leaf.size} height={leaf.size} viewBox="0 0 64 64" fill="none">
            {/* Hoja pequeña verde pastel */}
            <path
              d="M32 8 Q44 20 44 32 Q44 44 32 48 Q20 44 20 32 Q20 20 32 8 Z"
              fill={`rgba(165, 214, 167, ${leaf.opacity})`}
              stroke={`rgba(102, 187, 106, ${leaf.opacity * 1.5})`}
              strokeWidth="2"
            />
            <path
              d="M32 8 L32 48"
              stroke={`rgba(102, 187, 106, ${leaf.opacity})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingParticles;
