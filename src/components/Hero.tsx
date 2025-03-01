
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStaggeredAnimation } from '@/lib/animations';

export const Hero = () => {
  const orbitRef = useRef<HTMLDivElement>(null);
  const staggeredText = useStaggeredAnimation(4, 100, 300);
  
  useEffect(() => {
    if (!orbitRef.current) return;
    
    const addParticle = () => {
      if (!orbitRef.current) return;
      
      const particle = document.createElement('div');
      particle.classList.add('entangled-particle');
      
      // Random position around orbit
      const angle = Math.random() * Math.PI * 2;
      const radius = 120 + (Math.random() * 20);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      particle.style.left = `calc(50% + ${x}px)`;
      particle.style.top = `calc(50% + ${y}px)`;
      particle.style.width = `${6 + Math.random() * 8}px`;
      particle.style.height = `${6 + Math.random() * 8}px`;
      
      orbitRef.current.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 1500 + Math.random() * 1000);
    };
    
    const interval = setInterval(addParticle, 300);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.section 
      className="min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Orbital visualization */}
      <div className="relative h-80 w-80 mb-12">
        <div ref={orbitRef} className="w-full h-full relative">
          <motion.div 
            className="orbit w-64 h-64 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          
          <motion.div 
            className="orbit w-52 h-52 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}
            animate={{ rotate: -360 }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          
          {/* Core particle */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-quantum-accent/30 backdrop-blur-sm"
            animate={{ 
              boxShadow: [
                '0 0 10px 2px rgba(127, 90, 240, 0.3)',
                '0 0 20px 5px rgba(127, 90, 240, 0.5)',
                '0 0 10px 2px rgba(127, 90, 240, 0.3)'
              ] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="w-6 h-6 rounded-full bg-quantum-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
          
          {/* Orbiting particles */}
          <motion.div 
            className="w-5 h-5 rounded-full bg-quantum-accent absolute"
            style={{ top: 'calc(50% - 120px)', left: '50%', x: '-50%', y: '-50%' }}
            animate={{ 
              rotate: 360,
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <div className="w-full h-full rounded-full bg-white/80 mix-blend-overlay" />
          </motion.div>
          
          <motion.div 
            className="w-4 h-4 rounded-full bg-quantum-accent/80 absolute"
            style={{ top: '50%', left: 'calc(50% - 80px)', x: '-50%', y: '-50%' }}
            animate={{ 
              rotate: -360,
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        </div>
      </div>
      
      <div className="text-center max-w-3xl mx-auto">
        <motion.div 
          className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider font-medium mb-5 bg-quantum-accent/10 text-quantum-accent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Quantum Gaming Experience
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-medium mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="text-quantum-accent">Entangl</span>ion
        </motion.h1>
        
        <div className="space-y-4 text-foreground/80">
          {[
            "Explore quantum computing principles through gameplay",
            "Navigate the quantum universe with strategy and skill",
            "Build your quantum computer one gate at a time",
            "Harness the power of superposition and entanglement"
          ].map((text, index) => (
            <motion.p
              key={index}
              className="text-lg" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: staggeredText[index] ? 1 : 0, y: staggeredText[index] ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              {text}
            </motion.p>
          ))}
        </div>
        
        <motion.div 
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <a 
            href="#game-intro" 
            className="px-8 py-3 rounded-full bg-quantum-accent text-white font-medium tracking-wide hover:bg-quantum-accent-light transition-colors duration-300 inline-flex items-center shadow-lg shadow-quantum-accent/20"
          >
            Discover the Game
            <svg 
              className="w-4 h-4 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};
