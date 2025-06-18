import React, { useEffect, useRef, useCallback } from 'react';

// CursorTrail blockchain style: glow, morph, color igual a bg-primary-purple
function CursorTrail() {
  const cursorRef = useRef(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const opacity = useRef(0);
  const fadeTimeout = useRef(null);

  // El color debe coincidir con --primary-purple (usado en botones/etiquetas)
  // y tener un glow/halo elegante blockchain.
  const TRAIL_SIZE = 34; // px, tamaño del rastro
  const GLOW_SIZE = 70; // px, tamaño del halo blockchain

  const handleMouseMove = useCallback((e) => {
    if (!cursorRef.current) return;
    const deltaX = e.clientX - lastMousePosition.current.x;
    const deltaY = e.clientY - lastMousePosition.current.y;
    const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(${1 + speed * 0.013})`;

    opacity.current = 1;
    cursorRef.current.style.opacity = opacity.current;

    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    fadeTimeout.current = setTimeout(() => {
      opacity.current = 0;
      cursorRef.current.style.opacity = opacity.current;
    }, 120);

    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={cursorRef}
      className="fixed z-[9999] pointer-events-none"
      style={{
        width: TRAIL_SIZE,
        height: TRAIL_SIZE,
        left: 0,
        top: 0,
        borderRadius: '50%',
        opacity: 0,
        background: 'var(--primary-purple)',
        boxShadow: `
          0 0 0 0px var(--primary-purple),
          0 0 18px 5px var(--primary-purple),
          0 0 ${GLOW_SIZE}px 10px #9f6bff77,
          0 0 24px 10px #4f1d8966
        `,
        border: '2.5px solid #fff3',
        mixBlendMode: 'plus-lighter',
        transition: 'opacity 0.18s cubic-bezier(.6,.6,0,1), transform 0.07s cubic-bezier(.5,0,.5,1)',
        filter: 'blur(0.5px) saturate(1.3)',
        backdropFilter: 'blur(0.5px)',
        pointerEvents: 'none',
        userSelect: 'none',
        // Centro visual (por defecto -translate-x-1/2 -translate-y-1/2)
        transform: 'translate(0px, 0px) scale(1)'
      }}
    >
      {/* SVG decorativo sutil: red hexagonal (blockchain) */}
      <svg
        width={TRAIL_SIZE}
        height={TRAIL_SIZE}
        viewBox="0 0 34 34"
        fill="none"
        style={{
          position: 'absolute',
          left: 0, top: 0,
          filter: 'blur(0.3px)',
          pointerEvents: 'none',
        }}
      >
        <g opacity="0.28">
          <polygon
            points="17,3 30,11 30,27 17,34 4,27 4,11"
            stroke="#fff"
            strokeWidth="1"
            fill="none"
          />
          <polygon
            points="17,8 25,13 25,23 17,28 9,23 9,13"
            stroke="#fff"
            strokeWidth="0.5"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

export default CursorTrail;
