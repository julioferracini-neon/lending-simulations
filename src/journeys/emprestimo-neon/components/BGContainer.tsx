import React from 'react';

interface BGContainerProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * BGContainer:
 * Reprodução fiel em SVG do asset oficial "BGContainer.svg" da Neon.
 */
export const BGContainer: React.FC<BGContainerProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-white ${className}`}
      id="bg-container"
    >
      <img 
        src={`${import.meta.env.BASE_URL}assets/BGContainer.svg`}
        alt="" 
        className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
        aria-hidden="true" 
      />

      {/* Conteúdo sobreposto */}
      {children}
    </div>
  );
};

