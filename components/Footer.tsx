import React from 'react';
import { Box, Linkedin, Facebook, Youtube, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-slate-950 text-white pt-24 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-brand-600 p-2 rounded-xl text-white">
                <Box size={26} strokeWidth={3} />
              </div>
              <span className="text-3xl font-black tracking-tighter">Realview</span>
            </div>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-10 font-medium">
              Empowering real estate professionals to capture and share high-resolution 360° walkthroughs instantly using only their smartphone.
            </p>
            <div className="flex gap-5">
              {[Linkedin, Facebook, Youtube, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 text-slate-400 hover:bg-brand-600 hover:text-white transition-all shadow-xl">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-slate-500">Solutions</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li><a href="#" className="hover:text-brand-500 transition-colors">360 Capture App</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Walkthrough Editor</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Floor Plan Auto-Gen</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Batch Stitching</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-slate-500">Resources</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li><a href="#" className="hover:text-brand-500 transition-colors">Capture Guide</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Property Marketing</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Developer API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-slate-500">Realview</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li><a href="#" className="hover:text-brand-500 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-brand-500 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} Realview 360 Inc.
          </p>
          <div className="flex gap-8 text-[10px] font-black tracking-widest uppercase text-slate-500">
             <a href="#" className="hover:text-white transition-colors">Cookies</a>
             <a href="#" className="hover:text-white transition-colors">Security</a>
             <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          </div>
        </div>
      </div>
    </footer>
  );
};