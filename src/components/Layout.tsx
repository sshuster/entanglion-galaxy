
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { ParticleSystem } from './ParticleSystem';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="quantum-bg min-h-screen">
      <ParticleSystem />
      <Navigation />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            type: 'spring', 
            stiffness: 50, 
            damping: 15 
          }}
          className="pt-24 pb-16"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      <footer className="py-10 text-center text-sm text-foreground/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p>Entanglion - A Quantum Computing Board Game Experience</p>
          <p className="mt-2">Inspired by quantum computing principles</p>
        </div>
      </footer>
    </div>
  );
};
