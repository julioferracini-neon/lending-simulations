import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/src/design-system';
import { hapticLight, hapticSuccess } from '@/src/utils/haptics';

interface SuccessScreenProps {
  onFinish: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // Tactile celebration feedback on loan creation success
    hapticSuccess();

    // Dispara o confete de forma mais realista e comedida (uma única explosão elaborada)
    try {
      const count = 130;
      const colors = ['#e4a853', '#d99738', '#ffffff', '#f4ce90'];
      
      const defaults = {
        origin: { y: 0.6 },
        zIndex: 50,
        colors: colors,
      };

      const fire = (particleRatio: number, opts: any) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      };

      // Físicas realistas: variação de velocidade (startVelocity), decaimento (decay) e tamanho (scalar)
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.20, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.10, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.10, { spread: 120, startVelocity: 45 });
      
    } catch {
      // Safe fallback if confetti fails
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-[#eaf4ff] via-white to-white overflow-hidden select-none relative z-10" id="success-screen">
      
      {/* Top Bar Area */}
      <div className="w-full px-5 pt-12 pb-4 flex justify-end relative z-20">
        <button
          onClick={() => {
            hapticLight();
            onFinish();
          }}
          className="w-10 h-10 rounded-full bg-white text-[#0073ea] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-95 transition-transform cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-[28px] font-extrabold text-[#142742] tracking-tight leading-[1.1] mb-3 pr-8"
        >
          Parabéns, seu<br/>empréstimo foi realizado.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-[16px] text-[#5a738e]"
        >
          Seu dinheiro já está na sua conta Neon
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-start gap-3 mt-10"
        >
          <div className="w-11 h-11 rounded-full bg-[#f0f7ff] text-[#0073ea] flex items-center justify-center shrink-0">
            <Clock className="w-[22px] h-[22px]" strokeWidth={2.5} />
          </div>
          <p className="text-[14px] text-[#5a738e] leading-relaxed pt-1.5 pr-4">
            Pode levar alguns segundos para seu saldo atualizar
          </p>
        </motion.div>
      </div>

      <motion.footer 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-5 pb-8 pt-4 w-full bg-transparent"
      >
        <Button
          size="lg"
          onClick={() => {
            hapticLight();
            onFinish();
          }}
        >
          Concluir
        </Button>
      </motion.footer>
    </div>
  );
};

