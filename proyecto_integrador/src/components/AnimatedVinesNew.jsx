import React from 'react';

const AnimatedVines = ({ position = 'left' }) => {
  const isLeft = position === 'left';

  return (
    <div
      style={{
        position: 'fixed',
        [isLeft ? 'left' : 'right']: '0',
        top: 0,
        height: '100vh',
        width: '150px',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.85,
      }}
    >
      <svg
        width="150"
        height="100%"
        viewBox="0 0 150 1000"
        fill="none"
        preserveAspectRatio="xMinYMin meet"
        style={{ 
          transform: isLeft ? 'none' : 'scaleX(-1)',
          height: '100%',
          width: '100%',
        }}
      >
        <defs>
          {/* Definición de hoja para la enredadera - más delgada */}
          <g id="vine-leaf">
            <ellipse cx="0" cy="0" rx="8" ry="20" fill="#4CAF50" opacity="0.95"/>
            <ellipse cx="0" cy="0" rx="6" ry="17" fill="#66BB6A" opacity="0.85"/>
            <ellipse cx="-1" cy="0" rx="3" ry="12" fill="#81C784" opacity="0.7"/>
            <line x1="0" y1="-17" x2="0" y2="17" stroke="#2E7D32" strokeWidth="1.5"/>
          </g>
          
          {/* Definición de hoja que cae - más delgada y detallada */}
          <g id="falling-leaf">
            <ellipse cx="0" cy="0" rx="9" ry="24" fill="#4CAF50" opacity="0.95"/>
            <ellipse cx="0" cy="0" rx="7" ry="21" fill="#66BB6A" opacity="0.9"/>
            <ellipse cx="-1.5" cy="0" rx="4" ry="15" fill="#81C784" opacity="0.75"/>
            <line x1="0" y1="-21" x2="0" y2="21" stroke="#2E7D32" strokeWidth="1.8"/>
            <line x1="0" y1="-14" x2="-6" y2="-8" stroke="#2E7D32" strokeWidth="0.8" opacity="0.6"/>
            <line x1="0" y1="-4" x2="-7" y2="0" stroke="#2E7D32" strokeWidth="0.8" opacity="0.6"/>
            <line x1="0" y1="4" x2="-6" y2="9" stroke="#2E7D32" strokeWidth="0.8" opacity="0.6"/>
            <line x1="0" y1="14" x2="-5" y2="17" stroke="#2E7D32" strokeWidth="0.8" opacity="0.6"/>
          </g>
          
          {/* Definición de flor pequeña */}
          <g id="small-flower">
            <circle cx="0" cy="0" r="10" fill="#FFB6C1" opacity="0.9"/>
            <circle cx="0" cy="-7" r="5" fill="#FFD4E5"/>
            <circle cx="6" cy="-3.5" r="5" fill="#FFD4E5"/>
            <circle cx="6" cy="3.5" r="5" fill="#FFD4E5"/>
            <circle cx="0" cy="7" r="5" fill="#FFD4E5"/>
            <circle cx="-6" cy="3.5" r="5" fill="#FFD4E5"/>
            <circle cx="-6" cy="-3.5" r="5" fill="#FFD4E5"/>
            <circle cx="0" cy="0" r="4" fill="#FFD700"/>
          </g>
        </defs>

        {/* Enredadera principal única y elegante */}
        <path
          id="main-vine"
          d="M60 0 Q65 100 58 200 Q52 300 60 400 Q68 500 58 600 Q50 700 58 800 Q62 900 60 1000"
          stroke="#2E7D32"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: 1200,
            animation: 'drawMainVine 5s ease-out forwards'
          }}
        />

        {/* Hojas fijas a lo largo de la enredadera */}
        {Array.from({ length: 18 }).map((_, idx) => {
          const yPos = 80 + idx * 50;
          const xOffset = idx % 2 === 0 ? -20 : 20;
          const rotation = idx % 2 === 0 ? -35 : 35;
          
          return (
            <use
              key={`fixed-leaf-${idx}`}
              href="#vine-leaf"
              x={60 + xOffset}
              y={yPos}
              transform={`rotate(${rotation} ${60 + xOffset} ${yPos}) scale(0.65)`}
              style={{
                opacity: 0,
                animation: `fadeInVineLeaf 0.8s ease-out ${2 + idx * 0.15}s forwards`
              }}
            />
          );
        })}

        {/* Flores dispersas en la enredadera */}
        {[120, 280, 450, 620, 780, 920].map((yPos, idx) => (
          <use
            key={`flower-${idx}`}
            href="#small-flower"
            x={60 + (idx % 2 === 0 ? -15 : 15)}
            y={yPos}
            transform={`scale(1.2)`}
            style={{
              opacity: 0,
              animation: `fadeInVineLeaf 1s ease-out ${3.5 + idx * 0.3}s forwards`
            }}
          />
        ))}

        {/* Hojas que caen con animaciones complejas */}
        {[
          { id: 'leaf1', startX: 60, startY: 150, delay: 6 },
          { id: 'leaf2', startX: 70, startY: 320, delay: 8 },
          { id: 'leaf3', startX: 55, startY: 480, delay: 10 },
          { id: 'leaf4', startX: 65, startY: 650, delay: 12 },
          { id: 'leaf5', startX: 58, startY: 820, delay: 14 },
        ].map((leaf) => (
          <use
            key={leaf.id}
            id={leaf.id}
            href="#falling-leaf"
            x={leaf.startX}
            y={leaf.startY}
            style={{
              opacity: 0,
              transformOrigin: '50% 50%',
              animation: `
                fallingLeafSequence-${leaf.id} 20s ease-in-out ${leaf.delay}s infinite,
                fadeInFallingLeaf 1s ease-out ${leaf.delay}s forwards
              `
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes drawMainVine {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeInVineLeaf {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInFallingLeaf {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Animación compleja de caída para leaf1 */
        @keyframes fallingLeafSequence-leaf1 {
          0% { transform: rotate(7deg); }
          25% { transform: rotate(2deg); }
          26.5% { transform: rotate(7deg); }
          36.5% { transform: rotate(5deg); }
          44% { transform: translateY(960px) rotate(90deg); }
          69% { transform: translateY(960px) rotate(80deg); }
          84% { transform: translateY(960px) rotate(85deg); }
          100% { transform: translateY(960px) rotate(85deg); opacity: 0; }
        }

        /* Animación compleja de caída para leaf2 */
        @keyframes fallingLeafSequence-leaf2 {
          0% { transform: rotate(5deg); }
          25% { transform: rotate(0deg); }
          26.5% { transform: rotate(8deg); }
          36.5% { transform: rotate(3deg); }
          44% { transform: translateY(960px) rotate(85deg); }
          69% { transform: translateY(960px) rotate(75deg); }
          84% { transform: translateY(960px) rotate(82deg); }
          100% { transform: translateY(960px) rotate(82deg); opacity: 0; }
        }

        /* Animación compleja de caída para leaf3 */
        @keyframes fallingLeafSequence-leaf3 {
          0% { transform: rotate(9deg); }
          25% { transform: rotate(3deg); }
          26.5% { transform: rotate(10deg); }
          36.5% { transform: rotate(6deg); }
          44% { transform: translateY(960px) rotate(92deg); }
          69% { transform: translateY(960px) rotate(83deg); }
          84% { transform: translateY(960px) rotate(88deg); }
          100% { transform: translateY(960px) rotate(88deg); opacity: 0; }
        }

        /* Animación compleja de caída para leaf4 */
        @keyframes fallingLeafSequence-leaf4 {
          0% { transform: rotate(6deg); }
          25% { transform: rotate(1deg); }
          26.5% { transform: rotate(9deg); }
          36.5% { transform: rotate(4deg); }
          44% { transform: translateY(960px) rotate(88deg); }
          69% { transform: translateY(960px) rotate(78deg); }
          84% { transform: translateY(960px) rotate(84deg); }
          100% { transform: translateY(960px) rotate(84deg); opacity: 0; }
        }

        /* Animación compleja de caída para leaf5 */
        @keyframes fallingLeafSequence-leaf5 {
          0% { transform: rotate(8deg); }
          25% { transform: rotate(2deg); }
          26.5% { transform: rotate(11deg); }
          36.5% { transform: rotate(5deg); }
          44% { transform: translateY(960px) rotate(91deg); }
          69% { transform: translateY(960px) rotate(81deg); }
          84% { transform: translateY(960px) rotate(86deg); }
          100% { transform: translateY(960px) rotate(86deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedVines;
