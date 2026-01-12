import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { FadeIn } from './FadeIn.tsx';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=80" 
          alt="Modern Home" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <FadeIn delay={100}>
          <div className="inline-flex items-center gap-3 bg-brand-500/10 border border-brand-500/20 rounded-full px-5 py-2 text-brand-300 text-xs font-black uppercase tracking-[0.2em] mb-10">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></span>
            Realview 360: Pro Walkthroughs
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            Professional 360 Walkthroughs <br />
            <span className="text-brand-500">From Your Mobile</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Create immersive point-to-point tours in minutes using just your smartphone. No tripod, no extra gear, no monthly subscription to start.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-xl transition-all shadow-2xl shadow-brand-600/30 flex items-center justify-center gap-3 active:scale-95"
            >
              Start Scanning
              <ArrowRight size={24} />
            </button>
            <button 
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 backdrop-blur-xl active:scale-95"
            >
              <PlayCircle size={24} />
              Watch Demo
            </button>
          </div>
        </FadeIn>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-brand-500/50">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
};