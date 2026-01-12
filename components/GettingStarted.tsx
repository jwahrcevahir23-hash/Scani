import React from 'react';
import { ArrowRight, Camera, Settings, Share2 } from 'lucide-react';
import { FadeIn } from './FadeIn.tsx';

interface GettingStartedProps {
  onStart?: () => void;
}

export const GettingStarted: React.FC<GettingStartedProps> = ({ onStart }) => {
  const handleAction = () => {
    if (onStart) {
      onStart();
    } else {
      // Fallback if no handler provided
      alert("Please sign in to access this feature.");
    }
  };

  const steps = [
    {
      step: "01",
      icon: <Camera className="w-8 h-8" />,
      title: "Capture 3D Tours",
      description: "Download the app and follow the simple on-screen guide to scan your space. It takes less than 5 minutes for a standard room.",
      cta: "Learn How to Capture",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      step: "02",
      icon: <Settings className="w-8 h-8" />,
      title: "Edit on Console",
      description: "Upload your capture to the cloud. Use our powerful web editor to add tags, blur faces, and enhance the visual quality.",
      cta: "Edit 3D Tours",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      step: "03",
      icon: <Share2 className="w-8 h-8" />,
      title: "Activate and Share",
      description: "Generate a shareable link or embed code. Publish your tour to real estate listings, social media, or your website instantly.",
      cta: "Choose a Plan",
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <section id="start" className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How to Get Started for FREE</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start your journey into 3D capture today. No credit card required for free tier.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <FadeIn key={index} delay={index * 200} className="relative h-full">
              <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-colors duration-300 h-full flex flex-col hover:shadow-2xl hover:shadow-blue-900/20">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-blue-900/20 z-10 group-hover:bg-transparent transition-colors"></div>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white font-bold text-xl w-10 h-10 flex items-center justify-center rounded-lg shadow-lg z-20">
                    {item.step}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4 text-blue-400 bg-blue-400/10 w-fit p-3 rounded-xl border border-blue-400/20">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 mb-8 flex-1 leading-relaxed">{item.description}</p>
                  
                  <button 
                    onClick={handleAction}
                    className="flex items-center gap-2 text-white font-semibold hover:text-blue-400 transition-colors mt-auto group/btn w-fit"
                  >
                    {item.cta}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};