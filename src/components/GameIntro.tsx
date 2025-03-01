
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useElementOnScreen } from '@/lib/animations';

export const GameIntro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60]);
  
  const { ref: titleRef, isVisible: isTitleVisible } = useElementOnScreen({
    threshold: 0.3
  });
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1 * i,
        duration: 0.6
      }
    })
  };
  
  return (
    <section 
      id="game-intro" 
      ref={containerRef}
      className="py-24 relative"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div ref={titleRef} className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-5xl font-medium tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            The Quantum <span className="text-quantum-accent">Game Experience</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Entanglion combines strategic gameplay with quantum computing concepts,
            allowing players to build their own quantum computer while navigating challenges.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ opacity, y }}
        >
          {[
            {
              title: "Quantum Mechanics",
              description: "Learn about superposition, entanglement, and other quantum phenomena through engaging gameplay.",
              icon: (
                <svg className="w-12 h-12 text-quantum-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
                  <path d="M12 2V22" strokeWidth="1.5" />
                  <path d="M2 12H22" strokeWidth="1.5" />
                </svg>
              )
            },
            {
              title: "Strategic Planning",
              description: "Navigate your spaceship through the quantum universe, collecting resources and avoiding hazards.",
              icon: (
                <svg className="w-12 h-12 text-quantum-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L2 12H5V20H19V12H22L12 3Z" strokeWidth="1.5" />
                </svg>
              )
            },
            {
              title: "Quantum Circuits",
              description: "Build and optimize quantum circuits by placing gates and managing qubits to perform computations.",
              icon: (
                <svg className="w-12 h-12 text-quantum-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V8M12 16V18M6 12H8M16 12H18M7.05 7.05L8.46 8.46M16.95 7.05L15.54 8.46M7.05 16.95L8.46 15.54M16.95 16.95L15.54 15.54" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
                </svg>
              )
            },
            {
              title: "Competitive Play",
              description: "Compete with other players to be the first to build a functional quantum computer and execute algorithms.",
              icon: (
                <svg className="w-12 h-12 text-quantum-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13M16 3.13C17.7699 3.58317 19.0078 5.17747 19.0078 7.005C19.0078 8.83253 17.7699 10.4268 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" strokeWidth="1.5" />
                </svg>
              )
            },
            {
              title: "Educational Value",
              description: "Gain intuitive understanding of quantum computing principles through hands-on gameplay experiences.",
              icon: (
                <svg className="w-12 h-12 text-quantum-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.35418C12.7329 3.52375 13.8053 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C13.8053 11 12.7329 10.4762 12 9.64582M12 4.35418C11.2671 3.52375 10.1947 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11C10.1947 11 11.2671 10.4762 12 9.64582M12 4.35418V9.64582M12 9.64582V21" strokeWidth="1.5" />
                </svg>
              )
            },
            {
              title: "Immersive Experience",
              description: "Journey through a beautifully designed quantum universe with challenges inspired by real quantum computing problems.",
              icon: (
                <svg className="w-12 h-12 text-quantum-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12H3M12 21C7.02944 21 3 16.9706 3 12M12 21C13.6569 21 15 16.9706 15 12C15 7.02944 13.6569 3 12 3M12 21C10.3431 21 9 16.9706 9 12C9 7.02944 10.3431 3 12 3M3 12C3 7.02944 7.02944 3 12 3" strokeWidth="1.5" />
                </svg>
              )
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card p-8 rounded-xl hover-elevation"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
