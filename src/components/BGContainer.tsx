import React from 'react';

interface BGContainerProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * BGContainer:
 * Reprodução fiel em SVG do asset oficial "BGContainer.svg" da Neon (Figma node 4953-11001).
 * - Fundo com gradiente atmosférico vertical: azul-celeste no topo (#cae8ff) transicionando suavemente para branco puro na metade inferior (#ffffff).
 * - Onda ícone "n" em fita orgânica branca sólida, com dois arcos superiores simétricos, diagonal central e duas calhas inferiores com curvatura arredondada contínua.
 */
export const BGContainer: React.FC<BGContainerProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-white ${className}`}
      id="bg-container"
    >
      {/* Vetor SVG de fundo em alta precisão */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 360 800"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="bgContainerSky"
            x1="0"
            y1="0"
            x2="0"
            y2="800"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#cae8ff" />
            <stop offset="18%" stopColor="#bde0fd" />
            <stop offset="34%" stopColor="#d4ecff" />
            <stop offset="49%" stopColor="#f3f9ff" />
            <stop offset="56%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* Fundo em gradiente suave atmosférico com transição para branco a 50% da altura */}
        <rect width="360" height="800" fill="url(#bgContainerSky)" />

        {/* Onda icônica 'N' da Neon em branco sólido com curvatura orgânica e transições contínuas */}
        <g fill="#ffffff">
          {/* Coluna / Arco esquerdo (cápsula com inclinação característica de ~11 graus) */}
          <rect
            x="52"
            y="58"
            width="86"
            height="320"
            rx="43"
            transform="rotate(11 95 218)"
          />

          {/* Coluna / Arco direito (cápsula com inclinação característica de ~11 graus) */}
          <rect
            x="226"
            y="58"
            width="86"
            height="320"
            rx="43"
            transform="rotate(11 269 218)"
          />

          {/* Ponte fluida diagonal entre a base esquerda e a crista direita */}
          <path
            d="
              M 95 260
              C 125 260, 165 210, 205 155
              C 235 115, 255 100, 280 90
              L 292 135
              C 255 155, 215 220, 175 280
              C 140 330, 115 350, 75 340
              Z
            "
          />

          {/* Entrada fluida à esquerda */}
          <path
            d="
              M -15 205
              C 15 200, 32 180, 56 150
              L 72 186
              C 45 220, 20 250, -15 250
              Z
            "
          />

          {/* Saída fluida à direita */}
          <path
            d="
              M 285 295
              C 310 270, 340 235, 375 205
              L 375 252
              C 345 278, 318 312, 275 338
              Z
            "
          />

          {/* Círculos de preenchimento e concordância nas junções para continuidade fluida perfeita */}
          <circle cx="145" cy="238" r="38" />
          <circle cx="236" cy="178" r="38" />
        </g>
      </svg>

      {/* Conteúdo sobreposto */}
      {children}
    </div>
  );
};
