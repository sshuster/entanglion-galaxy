
import { useEffect, useState } from 'react';

// Intersection Observer hook for animations
export function useElementOnScreen(options: IntersectionObserverInit = {}) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref) {
      const observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, options);
      
      observer.observe(ref);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [ref, options]);

  return { ref: setRef, isVisible };
}

// Control for staggered animations
export function useStaggeredAnimation(
  totalItems: number, 
  staggerDelay: number = 100,
  initialDelay: number = 0
) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(totalItems).fill(false));
  
  useEffect(() => {
    const delays = Array.from({ length: totalItems }, (_, i) => i * staggerDelay + initialDelay);
    
    const timeouts = delays.map((delay, index) => {
      return setTimeout(() => {
        setVisibleItems(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, delay);
    });
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [totalItems, staggerDelay, initialDelay]);
  
  return visibleItems;
}

// Page transition animation
export function usePageTransition() {
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);
  
  const startTransition = () => {
    setIsPageTransitioning(true);
    
    // Return a promise that resolves when the transition starts
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
        
        // After a little more time, set transition complete
        setTimeout(() => {
          setTransitionComplete(true);
          
          // Reset transition states
          setTimeout(() => {
            setIsPageTransitioning(false);
            setTransitionComplete(false);
          }, 100);
        }, 600);
      }, 300);
    });
  };
  
  return { 
    isPageTransitioning, 
    transitionComplete,
    startTransition 
  };
}
