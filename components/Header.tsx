import React, { useState } from 'react';
import { Menu, X, Box } from 'lucide-react';

interface HeaderProps {
  isScrolled: boolean;
  onAuthClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isScrolled, onAuthClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Capture', href: '#capture' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAuthClick();
    setIsMobileMenuOpen(false);
  };

  const headerBgClass = isScrolled || isMobileMenuOpen ? 'bg-white/95 backdrop-blur-xl shadow-sm py-4 border-b border-gray-100' : 'bg-transparent py-6';
  const textColorClass = isScrolled || isMobileMenuOpen ? 'text-gray-950' : 'text-white';
  const navLinkClass = isScrolled ? 'text-gray-600 hover:text-brand-600' : 'text-white/80 hover:text-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBgClass}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="bg-brand-600 p-2 rounded-xl text-white group-hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20">
              <Box size={22} strokeWidth={3} />
            </div>
            <span className={`text-xl font-black tracking-tight ${textColorClass}`}>
              Realview
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-bold tracking-tight transition-colors ${navLinkClass}`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <button 
              onClick={handleStart}
              className={`text-sm font-bold tracking-tight transition-colors ${navLinkClass}`}
            >
              Sign In
            </button>
            <button 
              onClick={handleStart}
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-brand-600/20 hover:shadow-brand-600/40 hover:-translate-y-0.5"
            >
              Start Free
            </button>
          </div>

          <button 
            className="lg:hidden p-2 rounded-xl focus:outline-none bg-gray-100/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="text-gray-950" /> : <Menu className={textColorClass} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl h-screen animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-8 space-y-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-gray-950 text-4xl font-black tracking-tighter"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-12 flex flex-col gap-6">
              <button 
                onClick={handleStart}
                className="w-full text-center bg-brand-600 text-white font-black py-5 rounded-[2rem] text-xl shadow-2xl shadow-brand-600/20"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};