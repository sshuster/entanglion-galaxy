
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Rules', path: '/rules' },
    { name: 'About', path: '/about' }
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut' 
      }
    }
  };
  
  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1 + (i * 0.1),
        duration: 0.5,
        ease: 'easeOut'
      } 
    })
  };
  
  return (
    <motion.header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 lg:px-10",
        isScrolled ? 'py-3 bg-white/80 backdrop-blur-lg shadow-sm' : 'py-6'
      )}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-display font-medium tracking-tighter">
          <span className="text-quantum-accent">Entangl</span>ion
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link, i) => (
            <motion.div
              key={link.path}
              custom={i}
              variants={linkVariants}
              initial="hidden"
              animate="visible"
            >
              <Link 
                to={link.path} 
                className={cn(
                  "text-sm font-medium transition-colors relative py-2",
                  location.pathname === link.path 
                    ? "text-quantum-accent" 
                    : "text-foreground/80 hover:text-quantum-accent"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-quantum-accent/80"
                    layoutId="activeNavIndicator"
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col space-y-1.5 p-2 z-50"
          aria-label="Toggle menu"
        >
          <motion.span 
            className="w-6 h-0.5 bg-foreground rounded-full block"
            animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span 
            className="w-6 h-0.5 bg-foreground rounded-full block"
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span 
            className="w-6 h-0.5 bg-foreground rounded-full block"
            animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
        
        {/* Mobile Menu */}
        <motion.div 
          className={cn(
            "fixed inset-0 bg-white z-40 flex flex-col items-center justify-center md:hidden",
            !isMobileMenuOpen && "pointer-events-none"
          )}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col items-center space-y-8 py-8">
            {links.map((link, i) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={cn(
                  "text-xl font-medium relative py-2",
                  location.pathname === link.path 
                    ? "text-quantum-accent" 
                    : "text-foreground/80"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-quantum-accent/80" />
                )}
              </Link>
            ))}
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
};
