import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
  decayRate: number;
}

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  
  const createParticle = (x: number, y: number): Particle => {
    return {
      x,
      y,
      size: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      decayRate: 0.001 + Math.random() * 0.002,
    };
  };
  
  const init = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    // Initial particles
    particlesRef.current = [];
    const particleCount = Math.min(
      Math.floor((window.innerWidth * window.innerHeight) / 20000),
      50
    );
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particlesRef.current.push(createParticle(x, y));
    }
    
    const render = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      const updatedParticles: Particle[] = [];
      
      for (const particle of particlesRef.current) {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Slowly reduce opacity until decay
        particle.opacity -= particle.decayRate;
        
        // If still visible, keep it
        if (particle.opacity > 0) {
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(127, 90, 240, ${particle.opacity})`;
          ctx.fill();
          
          updatedParticles.push(particle);
        }
      }
      
      // Replace decayed particles
      while (updatedParticles.length < particleCount) {
        // Add new particles at random positions
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        updatedParticles.push(createParticle(x, y));
      }
      
      particlesRef.current = updatedParticles;
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationRef.current);
    };
  };
  
  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, []);
  
  return <canvas ref={canvasRef} className="particle-system" />;
};
