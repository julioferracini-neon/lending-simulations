import React, { useState } from 'react';
import { motion, type PanInfo } from 'motion/react';
import { hapticLight, hapticMedium } from '@/src/utils/haptics';

import foto1Img from '@/src/assets/offer-banner/foto1.png';
import foto2Img from '@/src/assets/offer-banner/foto2.png';
import buttonBannerSvg from '@/src/assets/offer-banner/Button-banner.svg';

interface HomeOfferCarouselProps {
  onSelectLoan?: () => void;
}

interface BannerItem {
  id: string;
  image: string;
  alt: string;
  text: string;
  actionType: 'loan' | 'investment';
}

const BANNERS: BannerItem[] = [
  {
    id: 'consignado',
    image: foto1Img,
    alt: 'Consignado Neon',
    text: 'Contrate o Consignado Neon com as melhores taxas e prazos.',
    actionType: 'loan',
  },
  {
    id: 'cdb',
    image: foto2Img,
    alt: 'CDB Neon',
    text: 'CDB 109% do CDI em 3 meses\nRentabilidade e segurança do FGC',
    actionType: 'investment',
  },
];

const CARD_WIDTH = 328;
const GAP = 8;
const STEP = CARD_WIDTH + GAP; // 336px

export const HomeOfferCarousel: React.FC<HomeOfferCarouselProps> = ({ onSelectLoan }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Timeout breve para evitar clique no término do drag
    setTimeout(() => setIsDragging(false), 80);
    const { offset, velocity } = info;
    const swipeThreshold = 40;
    const velocityThreshold = 250;

    if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      if (activeIndex < BANNERS.length - 1) {
        hapticLight();
        setActiveIndex(1);
      }
    } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      if (activeIndex > 0) {
        hapticLight();
        setActiveIndex(0);
      }
    }
  };

  const handleBannerClick = (banner: BannerItem) => {
    // Evita acionar clique se foi um gesto de arrastar
    if (isDragging) return;

    if (banner.actionType === 'loan') {
      hapticMedium();
      onSelectLoan?.();
    } else {
      hapticLight();
    }
  };

  return (
    <div className="w-full flex flex-col select-none overflow-hidden" id="home-offer-carousel">
      {/* Container de visualização com overflow visível nas bordas para o efeito de "peek" */}
      <div className="w-full overflow-hidden px-4">
        <motion.div
          className="flex cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ gap: `${GAP}px` }}
          drag="x"
          dragConstraints={{ left: -STEP * (BANNERS.length - 1), right: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={{ x: -activeIndex * STEP }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 32,
            mass: 0.8,
          }}
        >
          {BANNERS.map((banner, index) => (
            <motion.div
              key={banner.id}
              onClick={() => handleBannerClick(banner)}
              className="relative shrink-0 rounded-[16px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] cursor-pointer group"
              style={{
                width: `${CARD_WIDTH}px`,
                height: '160px',
              }}
              whileTap={{ scale: isDragging ? 1 : 0.985 }}
              transition={{ duration: 0.15 }}
            >
              {/* Imagem de Fundo em alta resolução cobrindo todo o card */}
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
                draggable={false}
              />

              {/* Componente Contextual Inferior (Glassmorphism oficial do Figma) */}
              <div
                className="absolute bottom-0 inset-x-0 h-[80px] px-4 py-2 flex items-center justify-between rounded-[16px] pointer-events-auto"
                style={{
                  backgroundColor: 'rgba(27, 33, 48, 0.55)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.25)',
                }}
              >
                {/* Texto do Banner */}
                <div className="flex-1 pr-3 flex items-center">
                  <p
                    className="text-white text-[14px] leading-[1.38] font-normal tracking-[-0.02em] whitespace-pre-line line-clamp-2"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {banner.text}
                  </p>
                </div>

                {/* Botão de Ação Redondo do Figma (45x45) */}
                <div className="shrink-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBannerClick(banner);
                    }}
                    className="w-[45px] h-[45px] flex items-center justify-center active:scale-90 transition-transform cursor-pointer focus:outline-none"
                    aria-label={`Acessar ${banner.alt}`}
                  >
                    <img
                      src={buttonBannerSvg}
                      alt="Avançar"
                      className="w-[45px] h-[45px] pointer-events-none"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bullets de Paginação Centralizados (Figma: gap 4px, w-2 h-2, #095A9C) */}
      <div className="w-full flex justify-center items-center gap-[4px] mt-2.5">
        {BANNERS.map((banner, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={banner.id}
              type="button"
              onClick={() => {
                hapticLight();
                setActiveIndex(index);
              }}
              className="p-1 cursor-pointer focus:outline-none flex items-center justify-center"
              aria-label={`Ir para banner ${index + 1}`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#095A9C] scale-100 opacity-100'
                    : 'bg-[#095A9C]/25 scale-90 hover:bg-[#095A9C]/40'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
