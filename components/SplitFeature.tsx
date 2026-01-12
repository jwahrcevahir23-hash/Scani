import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FadeIn } from './FadeIn.tsx';

interface SplitFeatureProps {
  id?: string;
  title: string;
  description: string;
  bullets: string[];
  imageUrl: string;
  imageAlt: string;
  reversed?: boolean;
  isMobileMockup?: boolean;
  icon?: React.ReactNode;
}

export const SplitFeature: React.FC<SplitFeatureProps> = ({
  id,
  title,
  description,
  bullets,
  imageUrl,
  imageAlt,
  reversed = false,
  isMobileMockup = false,
  icon
}) => {
  return (
    <section id={id} className="py-20 md:py-32 overflow-hidden border-b border-gray-100 last:border-0 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${reversed ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Visual Side */}
          <div className="w-full lg:w-1/2 relative flex justify-center">
            <FadeIn direction={reversed ? 'left' : 'right'} className="w-full flex justify-center">
              {isMobileMockup ? (
                // Phone Mockup
                <div className="relative w-[280px] md:w-[320px] h-[580px] md:h-[650px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden ring-1 ring-gray-900/5 transform rotate-[-3deg] hover:rotate-0 transition-transform duration-700 ease-out z-10">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
                  
                  {/* Screen Image */}
                  <div className="relative h-full w-full bg-gray-800">
                    <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
                    
                    {/* UI Overlay Mockup */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                       <div className="flex gap-4 mb-6">
                         <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                           <div className="w-4 h-4 bg-white rounded-sm"></div>
                         </div>
                         <div className="flex-1">
                           <div className="h-2 bg-white/40 rounded w-3/4 mb-2"></div>
                           <div className="h-2 bg-white/20 rounded w-1/2"></div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Standard Image with Decoration
                <div className="relative w-full max-w-lg">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-xl"></div>
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 group">
                     <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                     <img 
                      src={imageUrl} 
                      alt={imageAlt} 
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-1000" 
                    />
                  </div>
                </div>
              )}
            </FadeIn>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2">
            <FadeIn direction={reversed ? 'right' : 'left'}>
              <div className="flex items-center gap-3 mb-6">
                 {icon && <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">{icon}</div>}
                 <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Core Technology</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {title}
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {description}
              </p>

              <ul className="space-y-4">
                {bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{bullet}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
};