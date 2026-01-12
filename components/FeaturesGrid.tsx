import React from 'react';
import { Edit3, Wand2, LayoutTemplate } from 'lucide-react';
import { FadeIn } from './FadeIn.tsx';

interface FeatureCardProps {
  icon: React.ReactNode;
  image: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, image, title, description, delay }) => (
  <FadeIn delay={delay} className="h-full">
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100 transform hover:-translate-y-2">
      <div className="h-56 overflow-hidden relative">
        <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-all z-10"></div>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur p-3 rounded-xl shadow-md text-blue-600 ring-1 ring-gray-900/5">
          {icon}
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6 flex-1 text-sm md:text-base">
          {description}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-50">
          <a href="#start" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 text-sm uppercase tracking-wide">
            Learn more 
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </div>
  </FadeIn>
);

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: <Edit3 size={24} />,
      title: "All-in-One 3D Tour Editor",
      description: "Customize your virtual tours with multimedia tags, embedded videos, and brand logos. The intuitive editor makes post-processing a breeze.",
      image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Wand2 size={24} />,
      title: "AI-Powered Effortless Edit",
      description: "Our AI automatically removes the camera tripod from the nadir and fills in missing zenith details, creating a seamless 360° experience.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <LayoutTemplate size={24} />,
      title: "Effortless & Free Floor Plans",
      description: "Generate professional schematic floor plans automatically from your 3D data. Drag-and-drop editor allows for quick adjustments.",
      image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Enhance Your 3D Tour Effortlessly—For Free!
            </h2>
            <p className="text-lg text-gray-600">
              Professional tools without the professional price tag. Everything you need to create stunning virtual experiences.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              {...feature}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
};