import React from 'react';

export const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/5511985778639',
  youtube: 'https://www.youtube.com/@Portuguestatico',
  instagram: 'https://www.instagram.com/portuguestatico_/'
};

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface SocialButtonsProps {
  variant?: 'header' | 'footer' | 'card';
  className?: string;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({ variant = 'header', className = '' }) => {
  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
        {/* WhatsApp Principal */}
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          title="Fale com o Prof. Gabriel no WhatsApp (Tirar Dúvidas)"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* YouTube */}
        <a
          href={SOCIAL_LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          title="Canal do Português Tático no YouTube"
          className="p-1.5 sm:p-2 rounded-lg text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
        >
          <YouTubeIcon className="w-3.5 h-3.5" />
        </a>

        {/* Instagram */}
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram @portuguestatico_"
          className="p-1.5 sm:p-2 rounded-lg text-pink-600 hover:text-white bg-pink-50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-600 hover:to-purple-600 dark:bg-pink-950/40 dark:hover:bg-pink-600 border border-pink-200 dark:border-pink-900 transition-all cursor-pointer"
        >
          <InstagramIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`}>
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
          <span>Fale no WhatsApp (Dúvidas)</span>
        </a>

        <a
          href={SOCIAL_LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <YouTubeIcon className="w-3.5 h-3.5" />
          <span>YouTube @Portuguestatico</span>
        </a>

        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs font-semibold shadow-2xs transition-opacity"
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          <span>Instagram @portuguestatico_</span>
        </a>
      </div>
    );
  }

  // Card variant
  return (
    <div className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 ${className}`}>
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
        Redes Oficiais do Prof. Gabriel Figueiredo:
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0" />
          <div className="text-left">
            <span className="block font-bold">WhatsApp</span>
            <span className="text-[10px] text-emerald-100">Tire suas dúvidas</span>
          </div>
        </a>

        <a
          href={SOCIAL_LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <YouTubeIcon className="w-4 h-4 shrink-0" />
          <div className="text-left">
            <span className="block font-bold">YouTube</span>
            <span className="text-[10px] text-rose-100">Aulas e Dicas</span>
          </div>
        </a>

        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-semibold shadow-2xs transition-opacity"
        >
          <InstagramIcon className="w-4 h-4 shrink-0" />
          <div className="text-left">
            <span className="block font-bold">Instagram</span>
            <span className="text-[10px] text-pink-100">@portuguestatico_</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export const FloatingWhatsAppButton: React.FC = () => {
  return (
    <aside 
      aria-label="Atendimento via WhatsApp" 
      className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-30 select-none no-print"
    >
      <a
        href={SOCIAL_LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        title="Dúvidas? Fale Conosco no WhatsApp do Professor Gabriel"
        className="flex items-center gap-2 sm:gap-2.5 pl-2 pr-3.5 sm:pl-2.5 sm:pr-4 py-1.5 sm:py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg hover:shadow-xl border border-white/20 transition-all cursor-pointer group"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
          <WhatsAppIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[9px] sm:text-[10px] text-emerald-100 font-semibold uppercase tracking-wider">Tire Dúvidas</span>
          <span className="text-xs sm:text-sm font-extrabold tracking-tight">Fale Conosco</span>
        </div>
      </a>
    </aside>
  );
};
