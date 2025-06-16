// src/components/CursorTrail.jsx
import React, { useEffect, useRef, useCallback } from 'react';

// Este componente crea un rastro visual que sigue el cursor del ratón.
// Utiliza un elemento div y lo mueve y escala con transformaciones CSS.
function CursorTrail() {
  // Crea una referencia a nuestro elemento del rastro del cursor en el DOM.
  const cursorRef = useRef(null);
  // Almacena la última posición del ratón para cálculos de velocidad y dirección.
  const lastMousePosition = useRef({ x: 0, y: 0 });
  // Almacena la opacidad actual del rastro, para que se desvanezca.
  const opacity = useRef(0);
  // Un temporizador para actualizar la opacidad, creando un efecto de desvanecimiento suave.
  const fadeTimeout = useRef(null);

  // Usa useCallback para memorizar la función de movimiento del ratón.
  // Esto previene re-creaciones innecesarias de la función y optimiza el rendimiento.
  const handleMouseMove = useCallback((e) => {
    // Si el elemento del cursor no está listo, salimos.
    if (!cursorRef.current) return;

    // Calcula la velocidad del movimiento del ratón.
    const deltaX = e.clientX - lastMousePosition.current.x;
    const deltaY = e.clientY - lastMousePosition.current.y;
    // La magnitud del movimiento (distancia).
    const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Mueve el rastro del cursor a la posición actual del ratón.
    // Usamos transform para un rendimiento de animación más suave.
    cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(${1 + speed * 0.005})`; // Escalado ligero basado en velocidad

    // Hace que el rastro sea visible.
    opacity.current = 1;
    cursorRef.current.style.opacity = opacity.current;

    // Si ya hay un temporizador de desvanecimiento, lo limpiamos para reiniciar.
    if (fadeTimeout.current) {
      clearTimeout(fadeTimeout.current);
    }
    // Inicia un nuevo temporizador para desvanecer el rastro después de un corto retraso.
    fadeTimeout.current = setTimeout(() => {
      // Reduce la opacidad gradualmente.
      opacity.current = 0;
      cursorRef.current.style.opacity = opacity.current;
    }, 150); // El rastro comienza a desvanecerse después de 150ms

    // Actualiza la última posición del ratón.
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  }, []); // Dependencias vacías, la función no cambia a menos que se re-monte.

  // Configura los event listeners cuando el componente se monta.
  useEffect(() => {
    // Añade el event listener para el movimiento del ratón a todo el documento.
    document.addEventListener('mousemove', handleMouseMove);

    // Función de limpieza que se ejecuta cuando el componente se desmonta.
    // Esto es crucial para prevenir fugas de memoria.
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (fadeTimeout.current) {
        clearTimeout(fadeTimeout.current);
      }
    };
  }, [handleMouseMove]); // Solo se ejecuta si handleMouseMove cambia (lo cual no ocurre con useCallback y [] deps).

  return (
    // Este es el elemento visual del rastro del cursor.
    // Se posiciona absolutamente y se le da un estilo inicial.
    <div
      ref={cursorRef}
      className="fixed z-[9999] pointer-events-none w-8 h-8 rounded-full bg-purple-500 opacity-0 transition-opacity duration-150 ease-out -translate-x-1/2 -translate-y-1/2 shadow-lg"
      style={{
        transition: 'opacity 0.15s ease-out, transform 0.05s linear', // Transición rápida para el movimiento
      }}
    ></div>
  );
}

export default CursorTrail;
