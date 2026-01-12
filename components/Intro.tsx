import React from 'react';
import { FadeIn } from './FadeIn.tsx';

export const Intro: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
            Easily Capture Digital Spaces <br/>
            <span className="text-blue-600">With Just a Smartphone</span>
          </h2>
          
          <div className="w-24 h-1.5 bg-gray-200 mx-auto mb-10 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-blue-600 rounded-full"></div>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
            We've democratized 3D space capture. By leveraging advanced monocular depth estimation and SLAM algorithms, we allow anyone to create professional-grade digital twins without thousands of dollars in proprietary hardware.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};