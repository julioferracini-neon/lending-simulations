import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BGContainer } from './BGContainer';

interface ProposalLoadingScreenProps {
  onComplete: () => void;
}

export const ProposalLoadingScreen: React.FC<ProposalLoadingScreenProps> = ({ onComplete }) => {
  // stage 1: "Enviando" (3s), stage 2: "Pronto" (1s)
  const [stage, setStage] = useState<1 | 2>(1);

  useEffect(() => {
    // Stage 1: 3000ms
    const timer1 = setTimeout(() => {
      setStage(2);
    }, 3000);

    // Stage 2: 1000ms after Stage 1 (total 4000ms)
    const timer2 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <BGContainer className="relative h-full flex flex-col justify-between">
      {/* Content Section (ContentHolder): Posicionado no segundo terço de baixo da tela (~63% a 75% da altura) */}
      <div className="relative z-10 flex flex-col px-6 sm:px-7 pt-[63%]">
        {/* Dynamic Title ("Enviando" -> "Pronto") */}
        <div className="min-h-[40px] flex items-center">
          <AnimatePresence mode="wait">
            {stage === 1 ? (
              <motion.h1
                key="enviando"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="text-[29px] sm:text-[31px] font-bold text-[#142742] tracking-tight leading-none"
              >
                Enviando
              </motion.h1>
            ) : (
              <motion.h1
                key="pronto"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="text-[29px] sm:text-[31px] font-bold text-[#142742] tracking-tight leading-none"
              >
                Pronto
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Subtitle in Stage 1 ("Começamos a avaliar sua proposta"), omitted in Stage 2 */}
        <div className="min-h-[26px] mt-2 mb-6">
          <AnimatePresence>
            {stage === 1 ? (
              <motion.p
                key="sub-text"
                initial={{ opacity: 0, height: 'auto' }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="text-[15.5px] text-[#3d556f] font-normal leading-snug overflow-hidden"
              >
                Começamos a avaliar sua proposta
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Loading Bar Container matching ContentHolder.png */}
        <div className="w-full relative h-[4.5px] bg-[#edf2f8] rounded-full overflow-hidden">
          {/* Active bar with horizontal linear gradient: deep blue -> electric cyan */}
          <motion.div
            className="absolute top-0 left-0 bottom-0 rounded-full bg-gradient-to-r from-[#006ee6] via-[#00aaff] to-[#00d2ff]"
            initial={{ width: '12%' }}
            animate={{ width: stage === 1 ? '82%' : '100%' }}
            transition={{
              duration: stage === 1 ? 3.0 : 0.42,
              ease: stage === 1 ? [0.2, 0.05, 0.2, 1] : [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </div>

      {/* Bottom Guidance Message */}
      <div className="relative z-10 px-6 sm:px-7 pb-10 sm:pb-12 mt-auto">
        <p className="text-[13.5px] text-[#415d78] font-normal leading-[1.38]">
          Não feche o aplicativo,
          <br />
          é rapidinho.
        </p>
      </div>
    </BGContainer>
  );
};
