
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useElementOnScreen } from '@/lib/animations';

interface GameTile {
  id: string;
  name: string;
  type: 'planet' | 'gate' | 'resource' | 'hazard';
  description: string;
}

const gameTiles: GameTile[] = [
  { id: 'hadamard', name: 'Hadamard Gate', type: 'gate', description: 'Creates superposition from a single qubit' },
  { id: 'cnot', name: 'CNOT Gate', type: 'gate', description: 'Entangles two qubits' },
  { id: 'merge', name: 'Entanglement Sector', type: 'planet', description: 'A region where quantum entanglement is easy to achieve' },
  { id: 'quarks', name: 'Quark Repository', type: 'resource', description: 'Collect quantum building blocks' },
  { id: 'decoherence', name: 'Decoherence Zone', type: 'hazard', description: 'Your qubits may lose coherence here' },
  { id: 'toffoli', name: 'Toffoli Gate', type: 'gate', description: 'Three-qubit gate for advanced operations' },
  { id: 'strangelet', name: 'Strangelet Belt', type: 'hazard', description: 'Navigate carefully through this quantum anomaly' },
  { id: 'quantum-foam', name: 'Quantum Foam', type: 'resource', description: 'Harness the energy of space-time fluctuations' },
];

export const GameBoard = () => {
  const [selectedTile, setSelectedTile] = useState<GameTile | null>(null);
  const { ref: boardRef, isVisible: isBoardVisible } = useElementOnScreen({
    threshold: 0.3
  });
  
  const tileColors = {
    planet: 'bg-violet-100 border-violet-300 text-violet-800',
    gate: 'bg-teal-100 border-teal-300 text-teal-800',
    resource: 'bg-amber-100 border-amber-300 text-amber-800',
    hazard: 'bg-rose-100 border-rose-300 text-rose-800'
  };
  
  const tileVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({ 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.05 * i,
        duration: 0.4,
        type: 'spring',
        stiffness: 100
      }
    })
  };
  
  const handleTileClick = (tile: GameTile) => {
    setSelectedTile(tile === selectedTile ? null : tile);
  };
  
  return (
    <section className="py-24 bg-white/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-5xl font-medium tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-quantum-accent">Quantum</span> Game Board
          </motion.h2>
          <motion.p 
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Navigate through a universe of quantum phenomena, collect resources, and build your quantum computer.
          </motion.p>
        </div>
        
        <div ref={boardRef} className="relative">
          <motion.div 
            className="board-container relative aspect-square max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl border border-quantum-accent/20 bg-gradient-to-br from-gray-50 to-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isBoardVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
          >
            {/* Board grid */}
            <div className="absolute inset-0 quantum-grid" />
            
            {/* Game tiles */}
            <div className="board-tiles absolute inset-0 p-8 grid grid-cols-3 gap-4">
              {gameTiles.map((tile, i) => (
                <motion.div
                  key={tile.id}
                  className={`tile relative rounded-lg p-4 border-2 cursor-pointer transition-transform duration-300 hover:scale-105 ${tileColors[tile.type]}`}
                  variants={tileVariants}
                  initial="hidden"
                  animate={isBoardVisible ? "visible" : "hidden"}
                  custom={i}
                  onClick={() => handleTileClick(tile)}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="font-medium text-sm md:text-base">{tile.name}</h3>
                  <div className="text-xs mt-1 opacity-80">{tile.type}</div>
                </motion.div>
              ))}
            </div>
            
            {/* Player pieces */}
            <motion.div 
              className="absolute bottom-4 right-4 w-10 h-10 bg-quantum-accent rounded-full border-2 border-white shadow-lg"
              animate={{ 
                y: [0, -10, 0] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            <motion.div 
              className="absolute top-6 left-6 w-8 h-8 bg-teal-500 rounded-full border-2 border-white shadow-lg"
              animate={{ 
                y: [0, -8, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </motion.div>
          
          {/* Tile details */}
          <motion.div 
            className="mt-8 max-w-md mx-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: selectedTile ? 1 : 0,
              height: selectedTile ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
          >
            {selectedTile && (
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-medium mb-2">{selectedTile.name}</h3>
                <div className="inline-block px-2 py-1 rounded-full text-xs uppercase tracking-wider font-medium mb-3 bg-quantum-accent/10 text-quantum-accent">
                  {selectedTile.type}
                </div>
                <p className="text-foreground/70">{selectedTile.description}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
