import React from 'react';

const HeaderVines = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '400px',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="400"
        viewBox="0 0 1200 400"
        fill="none"
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          {/* Definición de hoja mejorada */}
          <g id="leaf-header">
            <ellipse cx="0" cy="0" rx="10" ry="16" fill="#4CAF50" opacity="0.95"/>
            <ellipse cx="0" cy="0" rx="8" ry="14" fill="#66BB6A" opacity="0.85"/>
            <line x1="0" y1="-14" x2="0" y2="14" stroke="#2E7D32" strokeWidth="1.2"/>
          </g>
          
          {/* Definición de flor pequeña */}
          <g id="flower-header">
            <circle cx="0" cy="0" r="6" fill="#FFB6C1"/>
            <circle cx="0" cy="-4.5" r="3" fill="#FFD4E5"/>
            <circle cx="3.9" cy="-2.25" r="3" fill="#FFD4E5"/>
            <circle cx="3.9" cy="2.25" r="3" fill="#FFD4E5"/>
            <circle cx="0" cy="4.5" r="3" fill="#FFD4E5"/>
            <circle cx="-3.9" cy="2.25" r="3" fill="#FFD4E5"/>
            <circle cx="-3.9" cy="-2.25" r="3" fill="#FFD4E5"/>
            <circle cx="0" cy="0" r="2.5" fill="#FFD700"/>
          </g>
        </defs>

        {/* Red de enredaderas que cuelgan desde el header */}
        {[
          // Rama izquierda
          { startX: 50, startY: 0, path: 'M50 0 Q30 40 40 80 Q50 120 35 160 Q25 200 30 240', leaves: 12, flowers: 3 },
          { startX: 120, startY: 0, path: 'M120 0 Q110 50 120 100 Q130 140 115 180 Q105 220 110 260', leaves: 11, flowers: 2 },
          { startX: 200, startY: 0, path: 'M200 0 Q180 45 195 90 Q210 130 190 170 Q180 210 185 250', leaves: 13, flowers: 3 },
          
          // Ramas centrales
          { startX: 400, startY: 0, path: 'M400 0 Q390 50 405 100 Q420 145 400 190 Q385 230 395 270', leaves: 14, flowers: 4 },
          { startX: 500, startY: 0, path: 'M500 0 Q480 55 495 110 Q510 150 490 195 Q475 235 485 275', leaves: 13, flowers: 3 },
          { startX: 600, startY: 0, path: 'M600 0 Q620 50 605 100 Q590 145 610 190 Q625 230 615 270', leaves: 14, flowers: 4 },
          { startX: 700, startY: 0, path: 'M700 0 Q710 45 695 90 Q680 135 700 180 Q715 220 705 260', leaves: 12, flowers: 3 },
          { startX: 800, startY: 0, path: 'M800 0 Q790 50 805 100 Q820 140 800 185 Q785 225 795 265', leaves: 13, flowers: 3 },
          
          // Rama derecha
          { startX: 1000, startY: 0, path: 'M1000 0 Q1020 40 1010 85 Q1000 125 1015 165 Q1025 205 1020 245', leaves: 12, flowers: 3 },
          { startX: 1080, startY: 0, path: 'M1080 0 Q1090 50 1080 100 Q1070 145 1085 185 Q1095 225 1090 265', leaves: 11, flowers: 2 },
          { startX: 1150, startY: 0, path: 'M1150 0 Q1170 45 1155 90 Q1140 130 1160 170 Q1175 210 1165 250', leaves: 13, flowers: 3 },
        ].map((vine, vineIdx) => {
          // Parsear el path para obtener puntos
          const pathPoints = [];
          const pathParts = vine.path.match(/[QM]\s*[\d\s]+/g);
          
          if (pathParts) {
            pathParts.forEach(part => {
              const coords = part.match(/\d+/g);
              if (coords && coords.length >= 2) {
                for (let i = 0; i < coords.length; i += 2) {
                  pathPoints.push({ x: parseInt(coords[i]), y: parseInt(coords[i + 1]) });
                }
              }
            });
          }

          return (
            <g key={`vine-${vineIdx}`}>
              {/* Tallo principal de la enredadera */}
              <path
                d={vine.path}
                stroke="#2E7D32"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 300,
                  strokeDashoffset: 300,
                  animation: `drawHeaderVine 2.5s ease-out ${vineIdx * 0.15}s forwards`
                }}
              />
              
              {/* Hojas distribuidas a lo largo de la enredadera */}
              {Array.from({ length: vine.leaves }).map((_, leafIdx) => {
                const progress = (leafIdx + 1) / (vine.leaves + 1);
                const pointIndex = Math.floor(progress * (pathPoints.length - 1));
                const point = pathPoints[pointIndex] || { x: vine.startX, y: progress * 250 };
                const angle = (leafIdx % 2 === 0 ? -45 : 45) + (Math.random() - 0.5) * 20;
                const offsetX = (leafIdx % 2 === 0 ? -15 : 15) + (Math.random() - 0.5) * 10;
                
                return (
                  <use
                    key={`leaf-${vineIdx}-${leafIdx}`}
                    href="#leaf-header"
                    x={point.x + offsetX}
                    y={point.y}
                    transform={`rotate(${angle} ${point.x + offsetX} ${point.y}) scale(0.7)`}
                    style={{
                      opacity: 0,
                      animation: `fadeInHeaderLeaf 0.6s ease-out ${2 + vineIdx * 0.15 + leafIdx * 0.08}s forwards`
                    }}
                  />
                );
              })}
              
              {/* Flores dispersas en la enredadera */}
              {Array.from({ length: vine.flowers }).map((_, flowerIdx) => {
                const progress = (flowerIdx + 1) / (vine.flowers + 1);
                const pointIndex = Math.floor(progress * (pathPoints.length - 1));
                const point = pathPoints[pointIndex] || { x: vine.startX, y: progress * 250 };
                const offsetX = (Math.random() - 0.5) * 30;
                const offsetY = Math.random() * 20;
                
                return (
                  <use
                    key={`flower-${vineIdx}-${flowerIdx}`}
                    href="#flower-header"
                    x={point.x + offsetX}
                    y={point.y + offsetY}
                    transform={`scale(1.3)`}
                    style={{
                      opacity: 0,
                      animation: `fadeInHeaderLeaf 0.8s ease-out ${3 + vineIdx * 0.2 + flowerIdx * 0.3}s forwards`
                    }}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Ramas secundarias más cortas para mayor densidad */}
        {[
          { x: 150, y: 0, length: 80, angle: 15 },
          { x: 300, y: 0, length: 70, angle: -10 },
          { x: 450, y: 0, length: 90, angle: 20 },
          { x: 650, y: 0, length: 75, angle: -15 },
          { x: 850, y: 0, length: 85, angle: 12 },
          { x: 950, y: 0, length: 70, angle: -18 },
        ].map((branch, idx) => {
          const endX = branch.x + Math.sin(branch.angle * Math.PI / 180) * branch.length;
          const endY = branch.y + branch.length;
          const midX = (branch.x + endX) / 2 + (Math.random() - 0.5) * 20;
          const midY = (branch.y + endY) / 2;
          
          return (
            <g key={`short-branch-${idx}`}>
              <path
                d={`M${branch.x} ${branch.y} Q${midX} ${midY} ${endX} ${endY}`}
                stroke="#2E7D32"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 100,
                  animation: `drawHeaderVine 1.5s ease-out ${0.8 + idx * 0.12}s forwards`
                }}
              />
              
              {/* 4-5 hojas en cada rama corta */}
              {Array.from({ length: 4 + Math.floor(Math.random() * 2) }).map((_, leafIdx) => {
                const t = (leafIdx + 1) / 5;
                const leafX = Math.pow(1-t, 2) * branch.x + 2*(1-t)*t*midX + Math.pow(t, 2)*endX;
                const leafY = Math.pow(1-t, 2) * branch.y + 2*(1-t)*t*midY + Math.pow(t, 2)*endY;
                const leafAngle = (leafIdx % 2 === 0 ? -50 : 50);
                
                return (
                  <use
                    key={`short-leaf-${idx}-${leafIdx}`}
                    href="#leaf-header"
                    x={leafX}
                    y={leafY}
                    transform={`rotate(${leafAngle} ${leafX} ${leafY}) scale(0.55)`}
                    style={{
                      opacity: 0,
                      animation: `fadeInHeaderLeaf 0.5s ease-out ${2.2 + idx * 0.12 + leafIdx * 0.1}s forwards`
                    }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      <style>{`
        @keyframes drawHeaderVine {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeInHeaderLeaf {
          from {
            opacity: 0;
            transform: scale(0) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HeaderVines;
