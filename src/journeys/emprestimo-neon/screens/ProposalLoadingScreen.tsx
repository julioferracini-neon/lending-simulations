import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BGContainer } from '../components/BGContainer';

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
    <BGContainer className="relative h-full flex flex-col">
      {/* Spacer to push content down to match Figma */}
      <div className="flex-1" />

      {/* Content Section positioned in the bottom third */}
      <div className="relative z-10 flex flex-col px-6 sm:px-7 pb-12">
        
        {/* Dynamic Title ("Enviando" -> "Pronto") */}
        <div className="min-h-[40px] flex items-center mb-1">
          <AnimatePresence mode="wait">
            {stage === 1 ? (
              <motion.h1
                key="enviando"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="text-[32px] sm:text-[34px] font-extrabold text-[#142742] tracking-tight leading-none"
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
                className="text-[32px] sm:text-[34px] font-extrabold text-[#142742] tracking-tight leading-none"
              >
                Pronto
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Subtitle in Stage 1 ("Começamos a avaliar sua proposta"), omitted in Stage 2 */}
        <div className="min-h-[26px] mb-8">
          <AnimatePresence>
            {stage === 1 ? (
              <motion.p
                key="sub-text"
                initial={{ opacity: 0, height: 'auto' }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="text-[17px] text-[#3d556f] font-normal leading-snug overflow-hidden"
              >
                Começamos a avaliar sua proposta
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Loading Bar (Single continuous track matching Figma) */}
        <div className="w-full relative h-[6px] bg-[#ebeffa] rounded-full overflow-hidden mb-16">
          <AnimatePresence>
            {stage === 1 && (
              <motion.div
                key="indeterminate"
                className="absolute top-0 bottom-0 bg-[#0073ea] rounded-full"
                initial={{ left: '-30%', right: '100%' }}
                animate={{ left: '100%', right: '-30%' }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  ease: [0.4, 0, 0.2, 1],
                  repeat: Infinity,
                }}
              />
            )}
          </AnimatePresence>

          {/* Full progress bar during Stage 2 ("Pronto") */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-[#0073ea] rounded-full z-10"
            initial={false}
            animate={{
              width: stage === 2 ? '100%' : '0%',
              opacity: stage === 2 ? 1 : 0,
            }}
            transition={{
              duration: stage === 2 ? 0.38 : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>

        {/* Bottom Guidance Message */}
        <p className="text-[13px] text-[#415d78] font-normal leading-[1.4]">
          Não feche o aplicativo,<br />
          é rapidinho.
        </p>
      </div>
    </BGContainer>
  );
};
