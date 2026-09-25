import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { ChevronRight, CreditCard, ArrowRight, TrendingUp } from 'lucide-react';
import { BottomNavBar, type MainTab } from '../shell/BottomNavBar';
import { PlaceholderBottomSheet, type PlaceholderContextData } from '../components/PlaceholderBottomSheet';
import { hapticLight, hapticMedium } from '@/src/utils/haptics';
import { HomeOfferCarousel } from './HomeOfferCarousel';

// Custom SVGs
import globalEyeSvg from '@/src/assets/home/global/eye.svg';
import globalSymbolSvg from '@/src/assets/home/global/Symbol-Left.svg';
import lenteNeonSvg from '@/src/assets/home/shortcuts/lente-neon.svg';
import enviarPixSvg from '@/src/assets/home/shortcuts/enviar-pix.svg';
import pagarSvg from '@/src/assets/home/shortcuts/pagar.svg';
import recargaSvg from '@/src/assets/home/shortcuts/recarga.svg';
import extratoCardSvg from '@/src/assets/home/extrato/extrato-card.svg';
import extratoEnviadoSvg from '@/src/assets/home/extrato/extrato-enviado.svg';
import extratoRecebidoSvg from '@/src/assets/home/extrato/extrato-recebido.svg';

interface GlobalHomeScreenProps {
  onSelectProducts: () => void;
  onSelectLoan: () => void;
  onSelectTab?: (tab: 'cartao' | 'pix' | 'investir') => void;
}

const SILKY_EASE = [0.22, 1, 0.36, 1] as const;

const screenEntranceVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
      duration: 0.7,
      ease: SILKY_EASE,
    },
  },
};

const itemEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: SILKY_EASE,
    },
  },
};

export const GlobalHomeScreen: React.FC<GlobalHomeScreenProps> = ({ 
  onSelectProducts, 
  onSelectLoan, 
  onSelectTab 
}) => {
  const [placeholderData, setPlaceholderData] = useState<PlaceholderContextData | null>(null);

  return (
    <motion.div
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col flex-1 min-h-0 relative select-none overflow-hidden"
      id="global-home-screen"
      style={{ background: 'linear-gradient(180deg, #83C5F9 0%, #B0D9F9 15%, #F1F4F5 60%, #F1F4F5 100%)' }}
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32 z-10 relative">
        <div className="flex flex-col pt-[80px] pb-8 gap-6">
          
          {/* Header */}
          <motion.div variants={itemEntranceVariants} className="flex justify-between items-center px-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-[20px] bg-[#F0F9FF] flex items-center justify-center">
                <span className="text-[#074A82] font-bold text-[20px]">J</span>
              </div>
              <span className="text-[#074A82] font-bold text-[16px] tracking-tight">Olá, Jennifer</span>
            </div>
            <div className="flex gap-4 pr-1">
              <button className="cursor-pointer active:scale-95 transition-transform">
                <img src={globalEyeSvg} alt="Visibilidade" className="w-10 h-10" />
              </button>
              <button 
                type="button"
                onClick={() => {
                  hapticLight();
                  setPlaceholderData({
                    title: 'Notificações e Ajustes',
                    description: 'Acesse suas notificações, mensagens da equipe Neon e preferências de conta.',
                    category: 'Perfil',
                  });
                }}
                className="cursor-pointer active:scale-95 transition-transform"
              >
                <img src={globalSymbolSvg} alt="Mais" className="w-10 h-10" />
              </button>
            </div>
          </motion.div>

          {/* Saldo Block */}
          <motion.div variants={itemEntranceVariants} className="px-4 flex justify-between items-center">
            <div className="flex flex-col gap-0">
              <span className="text-[#3F4658] font-semibold text-[14px] tracking-tight leading-none mb-1">Saldo</span>
              <span className="text-[#0078D9] font-bold text-[24px] tracking-tight leading-none">R$ 235,64</span>
            </div>
            <button 
              type="button"
              onClick={() => {
                hapticLight();
                setPlaceholderData({
                  title: 'Extrato da Conta',
                  description: 'Consulte o histórico completo de transferências, rendimentos e compras realizadas.',
                  category: 'Conta Digital',
                });
              }} 
              className="w-[48px] h-[48px] rounded-[16px] bg-[#F5FAFF] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              <ChevronRight className="w-[20px] h-[20px] text-[#0078D9]" strokeWidth={2.5} />
            </button>
          </motion.div>

          {/* Shortcuts / Quick Actions */}
          <motion.div variants={itemEntranceVariants} className="px-4">
            <div className="flex gap-[12px] w-full">
              <ShortcutItem 
                icon={<img src={lenteNeonSvg} alt="Lente Neon" className="w-6 h-6" />} 
                label="Lente Neon" 
                onClick={() => {
                  setPlaceholderData({
                    title: 'Lente Neon',
                    description: 'Monitore seus gastos por categorias com inteligência financeira visual em tempo real.',
                    category: 'Gestão Financeira',
                  });
                }}
              />
              <ShortcutItem 
                icon={<img src={enviarPixSvg} alt="Enviar Pix" className="w-6 h-6" />} 
                label="Enviar Pix" 
                onClick={() => {
                  if (onSelectTab) {
                    onSelectTab('pix');
                  }
                }}
              />
              <ShortcutItem 
                icon={<img src={pagarSvg} alt="Pagar" className="w-6 h-6" />} 
                label="Pagar" 
                onClick={() => {
                  setPlaceholderData({
                    title: 'Pagar Contas',
                    description: 'Pague boletos bancários com leitura rápida de código de barras ou linha digitável.',
                    category: 'Pagamentos',
                  });
                }}
              />
              <ShortcutItem 
                icon={<img src={recargaSvg} alt="Recarga" className="w-6 h-6" />} 
                label="Recarga" 
                onClick={() => {
                  setPlaceholderData({
                    title: 'Recarga de Celular',
                    description: 'Recarregue seu celular Vivo, Claro, TIM ou outras operadoras direto da sua conta.',
                    category: 'Serviços',
                  });
                }}
              />
            </div>
          </motion.div>

          {/* Offers Carousel Banner */}
          <motion.div variants={itemEntranceVariants}>
            <HomeOfferCarousel onSelectLoan={onSelectLoan} />
          </motion.div>
          
          {/* Modules Grid */}
          <motion.div variants={itemEntranceVariants} className="px-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Cartão Module (Camada 1 - Surface) */}
              <div 
                onClick={() => {
                  hapticLight();
                  onSelectTab?.('cartao');
                }}
                className="bg-white rounded-[24px] border border-[#E1E6F5] flex flex-col justify-between p-4 min-h-[156px] relative overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform"
              >
                <div className="flex flex-col gap-3">
                  <span className="font-bold text-[15px] text-[#2D3342]">Cartão</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#545B6F] text-[12px] font-medium leading-none">Fatura aberta</span>
                    <div className="text-[16px] font-bold text-[#2D3342] leading-none">R$ 268,80</div>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-[12px] text-[#545B6F] font-medium leading-tight">Vence em<br/><strong className="text-[#2D3342] font-bold">20 Jan</strong></span>
                  <div className="w-[32px] h-[32px] rounded-full bg-[#F5FAFF] flex items-center justify-center shrink-0">
                    <CreditCard className="w-[16px] h-[16px] text-[#0078D9]" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Limite Module */}
              <div 
                onClick={() => {
                  hapticLight();
                  setPlaceholderData({
                    title: 'Limite de Crédito',
                    description: 'Acompanhe a evolução do seu limite disponível e solicite revisões periódicas.',
                    category: 'Cartão',
                  });
                }}
                className="bg-white rounded-[24px] border border-[#E1E6F5] flex flex-col justify-between p-0 min-h-[156px] relative overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform"
              >
                <div className="p-4 flex flex-col gap-3 pb-0">
                  <span className="font-bold text-[15px] text-[#2D3342]">Limite</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#545B6F] text-[12px] font-medium leading-none">Disponível</span>
                    <div className="text-[16px] font-bold text-[#2D3342] leading-none">R$ 1.400,00</div>
                  </div>
                </div>
                {/* Wave Background Simulation */}
                <div className="relative w-full mt-auto">
                  <svg viewBox="0 0 156 16" className="absolute bottom-full left-0 w-full h-[14px]" preserveAspectRatio="none">
                    <path d="M0,16 Q78,-4 156,16 L156,16 L0,16 Z" fill="#E9F5FF"/>
                  </svg>
                  <div className="bg-[#E9F5FF] px-4 pb-4 pt-1 flex flex-col gap-[2px]">
                    <span className="text-[12px] text-[#0078D9] font-medium leading-none">Utilizado</span>
                    <span className="text-[13px] text-[#0078D9] font-bold leading-none">R$ 1.000,00</span>
                  </div>
                </div>
              </div>

              {/* Emprestimo Module */}
              <button 
                type="button"
                onClick={() => {
                  hapticMedium();
                  onSelectLoan();
                }}
                className="bg-white rounded-[24px] border border-[#E1E6F5] flex flex-col justify-between p-4 min-h-[156px] relative overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform text-left"
              >
                <div className="flex flex-col gap-3">
                  <span className="font-bold text-[15px] text-[#2D3342]">Emprestimo</span>
                  <span className="text-[#545B6F] text-[12px] font-medium leading-tight pr-2">Novo crédito do trabalhador para quem é CLT</span>
                </div>
                <div className="flex justify-between items-end mt-4 w-full">
                  <span className="text-[14px] text-[#0078D9] font-bold mb-[2px]">Simular</span>
                  <div className="w-[32px] h-[32px] rounded-full bg-[#F5FAFF] flex items-center justify-center shrink-0">
                    <ArrowRight className="w-[16px] h-[16px] text-[#0078D9]" strokeWidth={2.5} />
                  </div>
                </div>
              </button>

              {/* Investimentos Module (Camada 1 - Surface) */}
              <div 
                onClick={() => {
                  hapticLight();
                  onSelectTab?.('investir');
                }}
                className="bg-white rounded-[24px] border border-[#E1E6F5] flex flex-col justify-between p-4 min-h-[156px] relative overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform"
              >
                <div className="flex flex-col gap-3">
                  <span className="font-bold text-[15px] text-[#2D3342]">Investimentos</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#545B6F] text-[12px] font-medium leading-none">Total investido</span>
                    <div className="text-[16px] font-bold text-[#2D3342] leading-none">R$ 2.567,78</div>
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[11px] text-[#17652A] font-medium leading-none">Já rendeu</span>
                    <span className="text-[12px] text-[#17652A] font-bold leading-none">R$ 24,54</span>
                  </div>
                  <div className="w-[32px] h-[32px] rounded-full bg-[#EBF6ED] flex items-center justify-center shrink-0">
                    <TrendingUp className="w-[16px] h-[16px] text-[#17652A]" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Extrato / Últimos lançamentos */}
          <motion.div variants={itemEntranceVariants} className="px-4 flex flex-col gap-4 mt-2">
            <h2 className="text-[#2D3342] font-bold text-[16px] tracking-tight">Últimos lançamentos</h2>
            <div className="flex flex-col">
              {/* Item 1 */}
              <div className="flex items-center justify-between py-[14px] border-b border-[#E1E6F5]">
                <div className="flex items-center gap-4">
                  <img src={extratoCardSvg} alt="Cartão" className="w-[44px] h-[44px]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#2D3342] font-semibold text-[14px] leading-tight">Padaria da Villa</span>
                    <span className="text-[#545B6F] font-medium text-[12px] leading-tight">Compra no débito</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[#2D3342] font-bold text-[14px] leading-tight">R$ 27,40</span>
                  <span className="text-[#545B6F] font-medium text-[12px] leading-tight">17h20</span>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex items-center justify-between py-[14px] border-b border-[#E1E6F5]">
                <div className="flex items-center gap-4">
                  <img src={extratoRecebidoSvg} alt="Recebido" className="w-[44px] h-[44px]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#2D3342] font-semibold text-[14px] leading-tight">Maria de Sousa</span>
                    <span className="text-[#545B6F] font-medium text-[12px] leading-tight">Pix recebido</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[#17652A] font-bold text-[14px] leading-tight">+ R$ 60,00</span>
                  <span className="text-[#545B6F] font-medium text-[12px] leading-tight">12h45</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between py-[14px] border-b border-[#E1E6F5]">
                <div className="flex items-center gap-4">
                  <img src={extratoRecebidoSvg} alt="Recebido" className="w-[44px] h-[44px]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#2D3342] font-semibold text-[14px] leading-tight">Mateus Moretti Araujo</span>
                    <span className="text-[#545B6F] font-medium text-[12px] leading-tight">TED recebido</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[#17652A] font-bold text-[14px] leading-tight">+ R$ 60,00</span>
                  <span className="text-[#545B6F] font-medium text-[12px] leading-tight">12h45</span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-center justify-between py-[14px] border-b border-[#E1E6F5]">
                <div className="flex items-center gap-4">
                  <img src={extratoRecebidoSvg} alt="Recebido" className="w-[44px] h-[44px]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#2D3342] font-semibold text-[14px] leading-tight">Maria de Sousa</span>
                    <span className="text-[#545B6F] font-medium text-[12px] leading-tight">Boleto recebido</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[#17652A] font-bold text-[14px] leading-tight">+ R$ 60,00</span>
                  <span className="text-[#545B6F] font-medium text-[12px] leading-tight">12h45</span>
                </div>
              </div>

              {/* Item 5 */}
              <div className="flex items-center justify-between py-[14px]">
                <div className="flex items-center gap-4">
                  <img src={extratoEnviadoSvg} alt="Enviado" className="w-[44px] h-[44px]" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#2D3342] font-semibold text-[14px] leading-tight">Bernadete Faria</span>
                    <span className="text-[#545B6F] font-medium text-[12px] leading-tight">Pix enviado</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-[#2D3342] font-bold text-[14px] leading-tight">R$ 60,00</span>
                  <span className="text-[#545B6F] font-medium text-[12px] leading-tight">12h45</span>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => {
                hapticLight();
                setPlaceholderData({
                  title: 'Extrato Completo',
                  description: 'Acesse o extrato consolidado de todas as movimentações financeiras da sua conta Neon.',
                  category: 'Conta Digital',
                });
              }}
              className="w-full mt-2 bg-[#E9F5FF] text-[#0078D9] font-bold text-[14px] py-[14px] rounded-[24px] flex items-center justify-center cursor-pointer hover:bg-[#D9EFFF] active:scale-[0.98] transition-transform"
            >
              Ver todos os lançamentos
            </button>
          </motion.div>
        </div>
      </div>

      {/* Surface Bottom Bar */}
      <BottomNavBar
        activeTab="home"
        onSelectHome={() => {}}
        onSelectProducts={onSelectProducts}
        onSelectTab={(tab: MainTab) => {
          if (tab === 'cartao' || tab === 'pix' || tab === 'investir') {
            onSelectTab?.(tab);
          }
        }}
      />

      {/* Second Layer: Placeholder Bottom Sheet */}
      <PlaceholderBottomSheet
        isOpen={!!placeholderData}
        onClose={() => setPlaceholderData(null)}
        data={placeholderData}
      />
    </motion.div>
  );
};

const ShortcutItem = ({ 
  icon, 
  label, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick?: () => void; 
}) => {
  return (
    <button 
      type="button"
      onClick={() => {
        hapticLight();
        onClick?.();
      }}
      className="flex flex-col flex-1 items-center gap-[8px] cursor-pointer focus:outline-none active:opacity-70 transition-opacity"
    >
      <div className="w-full aspect-square bg-[#F5FAFF] rounded-[22px] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="text-[12px] font-semibold text-[#3F4658] text-center leading-none whitespace-nowrap">
        {label}
      </span>
    </button>
  );
};
