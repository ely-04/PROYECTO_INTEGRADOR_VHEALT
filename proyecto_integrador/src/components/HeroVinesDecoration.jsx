import React from 'react';

const HeroVinesDecoration = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '1200px',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: 0.7 }}
      >
        <defs>
          {/* Hoja delgada y elegante */}
          <g id="elegant-leaf">
            <ellipse cx="0" cy="0" rx="6" ry="16" fill="#2E7D32" opacity="0.9"/>
            <ellipse cx="0" cy="0" rx="4" ry="14" fill="#388E3C" opacity="0.8"/>
            <line x1="0" y1="-14" x2="0" y2="14" stroke="#1B5E20" strokeWidth="1.2"/>
          </g>
        </defs>

        {/* Enredaderas decorativas lado izquierdo */}
        {/* Rama superior izquierda con curva elegante */}
        <path
          d="M50 120 Q150 100 250 140 Q320 170 380 150"
          stroke="#2E7D32"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: 400,
            animation: 'drawHeroVine 3s ease-out 0.5s forwards'
          }}
        />
        
        {/* Hojas en rama superior izquierda */}
        {[
          { x: 80, y: 115, rot: -45 },
          { x: 120, y: 108, rot: 35 },
          { x: 170, y: 105, rot: -50 },
          { x: 210, y: 115, rot: 40 },
          { x: 250, y: 140, rot: -35 },
          { x: 290, y: 160, rot: 45 },
          { x: 330, y: 162, rot: -40 },
          { x: 370, y: 152, rot: 50 },
        ].map((leaf, idx) => (
          <use
            key={`left-top-leaf-${idx}`}
            href="#elegant-leaf"
            x={leaf.x}
            y={leaf.y}
            transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y}) scale(0.8)`}
            style={{
              opacity: 0,
              animation: `fadeInHeroLeaf 0.6s ease-out ${3.5 + idx * 0.1}s forwards`
            }}
          />
        ))}

        {/* Rama inferior izquierda con curva inversa */}
        <path
          d="M100 450 Q180 480 280 440 Q350 410 420 430"
          stroke="#2E7D32"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: 400,
            animation: 'drawHeroVine 3s ease-out 0.8s forwards'
          }}
        />

        {/* Hojas en rama inferior izquierda */}
        {[
          { x: 130, y: 460, rot: -40 },
          { x: 170, y: 472, rot: 48 },
          { x: 220, y: 468, rot: -45 },
          { x: 270, y: 445, rot: 38 },
          { x: 320, y: 420, rot: -50 },
          { x: 370, y: 418, rot: 42 },
          { x: 410, y: 428, rot: -38 },
        ].map((leaf, idx) => (
          <use
            key={`left-bottom-leaf-${idx}`}
            href="#elegant-leaf"
            x={leaf.x}
            y={leaf.y}
            transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y}) scale(0.8)`}
            style={{
              opacity: 0,
              animation: `fadeInHeroLeaf 0.6s ease-out ${4 + idx * 0.1}s forwards`
            }}
          />
        ))}

        {/* Enredaderas decorativas lado derecho */}
        {/* Rama superior derecha con curva elegante */}
        <path
          d="M1150 120 Q1050 100 950 140 Q880 170 820 150"
          stroke="#2E7D32"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: 400,
            animation: 'drawHeroVine 3s ease-out 0.6s forwards'
          }}
        />

        {/* Hojas en rama superior derecha */}
        {[
          { x: 1120, y: 115, rot: 45 },
          { x: 1080, y: 108, rot: -35 },
          { x: 1030, y: 105, rot: 50 },
          { x: 990, y: 115, rot: -40 },
          { x: 950, y: 140, rot: 35 },
          { x: 910, y: 160, rot: -45 },
          { x: 870, y: 162, rot: 40 },
          { x: 830, y: 152, rot: -50 },
        ].map((leaf, idx) => (
          <use
            key={`right-top-leaf-${idx}`}
            href="#elegant-leaf"
            x={leaf.x}
            y={leaf.y}
            transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y}) scale(0.8)`}
            style={{
              opacity: 0,
              animation: `fadeInHeroLeaf 0.6s ease-out ${3.6 + idx * 0.1}s forwards`
            }}
          />
        ))}

        {/* Rama inferior derecha con curva inversa */}
        <path
          d="M1100 450 Q1020 480 920 440 Q850 410 780 430"
          stroke="#2E7D32"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: 400,
            animation: 'drawHeroVine 3s ease-out 0.9s forwards'
          }}
        />

        {/* Hojas en rama inferior derecha */}
        {[
          { x: 1070, y: 460, rot: 40 },
          { x: 1030, y: 472, rot: -48 },
          { x: 980, y: 468, rot: 45 },
          { x: 930, y: 445, rot: -38 },
          { x: 880, y: 420, rot: 50 },
          { x: 830, y: 418, rot: -42 },
          { x: 790, y: 428, rot: 38 },
        ].map((leaf, idx) => (
          <use
            key={`right-bottom-leaf-${idx}`}
            href="#elegant-leaf"
            x={leaf.x}
            y={leaf.y}
            transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y}) scale(0.8)`}
            style={{
              opacity: 0,
              animation: `fadeInHeroLeaf 0.6s ease-out ${4.1 + idx * 0.1}s forwards`
            }}
          />
        ))}

        {/* Espirales decorativas pequeñas */}
        <path
          d="M420 180 Q440 170 450 185 Q455 200 445 210"
          stroke="#2E7D32"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: 'drawHeroVine 2s ease-out 1.5s forwards'
          }}
        />

        <path
          d="M780 180 Q760 170 750 185 Q745 200 755 210"
          stroke="#2E7D32"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: 'drawHeroVine 2s ease-out 1.6s forwards'
          }}
        />

        {/* Pequeñas hojas en espirales */}
        {[
          { x: 430, y: 175, rot: -30 },
          { x: 445, y: 195, rot: 40 },
          { x: 770, y: 175, rot: 30 },
          { x: 755, y: 195, rot: -40 },
        ].map((leaf, idx) => (
          <use
            key={`spiral-leaf-${idx}`}
            href="#elegant-leaf"
            x={leaf.x}
            y={leaf.y}
            transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y}) scale(0.6)`}
            style={{
              opacity: 0,
              animation: `fadeInHeroLeaf 0.5s ease-out ${4.5 + idx * 0.15}s forwards`
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes drawHeroVine {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeInHeroLeaf {
          from {
            opacity: 0;
            transform: scale(0) rotate(180deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroVinesDecoration;
