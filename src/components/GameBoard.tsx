
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useElementOnScreen } from '@/lib/animations';
import { useGame, GameTile, initialGameTiles } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const GameBoard = () => {
  const { gameState, startGame, movePlayer, collectResource, acquireGate, buildCircuit, endTurn, resetGame } = useGame();
  const [selectedTile, setSelectedTile] = useState<GameTile | null>(null);
  const [selectedGates, setSelectedGates] = useState<string[]>([]);
  const [qubitAmount, setQubitAmount] = useState(1);
  const { toast } = useToast();
  
  const { ref: boardRef, isVisible: isBoardVisible } = useElementOnScreen({
    threshold: 0.3
  });
  
  // Initialize game with two players if not started
  useEffect(() => {
    if (!gameState.gameStarted && !gameState.players.length) {
      // Don't auto-start the game, wait for user to click "Start Game"
    }
  }, [gameState, startGame]);
  
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
    
    // If game is in progress and it's movement phase, try to move player
    if (gameState.gameStarted && gameState.phase === 'movement') {
      movePlayer(tile.position.row, tile.position.col);
    }
  };
  
  const handleResourceCollection = () => {
    if (!selectedTile || !selectedTile.resources) {
      toast({
        title: "No resources available",
        description: "This tile doesn't have resources to collect.",
        variant: "destructive"
      });
      return;
    }
    
    collectResource(selectedTile.id);
    toast({
      title: "Resources collected!",
      description: `You collected ${selectedTile.resources.qubits || 0} qubits and ${selectedTile.resources.energy || 0} energy.`
    });
  };
  
  const handleGateAcquisition = () => {
    if (!selectedTile || selectedTile.type !== 'gate') {
      toast({
        title: "Not a gate",
        description: "You can only acquire gates from gate tiles.",
        variant: "destructive"
      });
      return;
    }
    
    acquireGate(selectedTile.id);
    toast({
      title: "Gate acquired!",
      description: `You acquired the ${selectedTile.name}.`
    });
  };
  
  const handleBuildCircuit = () => {
    if (selectedGates.length === 0) {
      toast({
        title: "No gates selected",
        description: "You need to select at least one gate to build a circuit.",
        variant: "destructive"
      });
      return;
    }
    
    if (qubitAmount <= 0) {
      toast({
        title: "Invalid qubit amount",
        description: "You need at least 1 qubit to build a circuit.",
        variant: "destructive"
      });
      return;
    }
    
    buildCircuit(selectedGates, qubitAmount);
    setSelectedGates([]);
    setQubitAmount(1);
    
    toast({
      title: "Circuit built!",
      description: `You built a circuit with ${selectedGates.length} gates and ${qubitAmount} qubits.`
    });
  };
  
  const handleEndTurn = () => {
    endTurn();
    toast({
      title: "Turn ended",
      description: `It's now ${gameState.players[(gameState.currentPlayerIndex + 1) % gameState.players.length]?.name}'s turn.`
    });
  };
  
  const handleToggleGate = (gateId: string) => {
    setSelectedGates(prev => 
      prev.includes(gateId)
        ? prev.filter(id => id !== gateId)
        : [...prev, gateId]
    );
  };
  
  const getCurrentPlayer = () => {
    if (!gameState.gameStarted || gameState.players.length === 0) return null;
    return gameState.players[gameState.currentPlayerIndex];
  };
  
  const currentPlayer = getCurrentPlayer();
  
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
            className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Navigate through a universe of quantum phenomena, collect resources, and build your quantum computer.
          </motion.p>
          
          {!gameState.gameStarted && (
            <div className="flex justify-center gap-4 mb-8">
              <Button onClick={() => startGame(['Player 1', 'Player 2'])} className="bg-quantum-accent">
                Start Game
              </Button>
            </div>
          )}
          
          {gameState.gameStarted && gameState.winner && (
            <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg p-4 mb-8">
              <h3 className="text-xl font-bold">🎉 We have a winner!</h3>
              <p>{gameState.winner} has won the game by building 3 quantum circuits!</p>
              <Button onClick={resetGame} className="mt-2 bg-quantum-accent">
                Play Again
              </Button>
            </div>
          )}
          
          {gameState.gameStarted && !gameState.winner && (
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="glass-card p-4 rounded-xl w-full max-w-3xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">
                    Turn {gameState.turn} • Phase: <span className="capitalize">{gameState.phase}</span>
                  </h3>
                  <div className="text-right">
                    <span className="font-bold">{currentPlayer?.name}'s Turn</span>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentPlayer?.color }}></span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <h4 className="font-medium mb-1">Resources</h4>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-quantum-accent">⚛ Qubits:</span> {currentPlayer?.resources.qubits}
                      </div>
                      <div>
                        <span className="text-quantum-accent">⚡ Energy:</span> {currentPlayer?.resources.energy}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 rounded-lg p-3">
                    <h4 className="font-medium mb-1">Gates</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentPlayer?.gates.length === 0 && (
                        <span className="text-gray-500">No gates acquired yet</span>
                      )}
                      
                      {currentPlayer?.gates.map((gate, i) => {
                        const gateTile = initialGameTiles.find(t => t.id === gate);
                        return (
                          <span key={`${gate}-${i}`} className="inline-block px-2 py-1 bg-teal-100 text-xs rounded">
                            {gateTile?.name || gate}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {gameState.phase === 'movement' && (
                    <div className="text-sm bg-quantum-accent/10 rounded-lg px-3 py-2 flex-grow">
                      Click on a tile to move your player piece
                    </div>
                  )}
                  
                  {gameState.phase === 'action' && (
                    <div className="flex gap-2 flex-grow flex-wrap">
                      <Button 
                        variant="outline" 
                        onClick={handleResourceCollection}
                        disabled={!selectedTile || !selectedTile.resources}
                        className="flex-grow"
                      >
                        Collect Resources
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={handleGateAcquisition}
                        disabled={!selectedTile || selectedTile.type !== 'gate' || (currentPlayer?.resources.energy || 0) < 2}
                        className="flex-grow"
                      >
                        Acquire Gate (costs 2 energy)
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => endTurn()}
                        className="flex-grow"
                      >
                        Skip Action
                      </Button>
                    </div>
                  )}
                  
                  {gameState.phase === 'build' && (
                    <div className="w-full">
                      <div className="bg-white/50 rounded-lg p-3 mb-2">
                        <h4 className="font-medium mb-2">Build a Quantum Circuit</h4>
                        
                        <div className="mb-2">
                          <h5 className="text-sm font-medium">Select Gates:</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {currentPlayer?.gates.length === 0 ? (
                              <span className="text-gray-500 text-sm">No gates available</span>
                            ) : (
                              currentPlayer?.gates.map((gate, index) => {
                                const gateTile = initialGameTiles.find(t => t.id === gate);
                                return (
                                  <button
                                    key={`${gate}-${index}`}
                                    onClick={() => handleToggleGate(gate)}
                                    className={`px-2 py-1 text-xs rounded transition-colors ${
                                      selectedGates.includes(gate) 
                                        ? 'bg-quantum-accent text-white' 
                                        : 'bg-teal-100 hover:bg-teal-200'
                                    }`}
                                  >
                                    {gateTile?.name || gate}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-sm font-medium">Qubits to use: {qubitAmount}</h5>
                          <input 
                            type="range" 
                            min="1" 
                            max={Math.min(5, currentPlayer?.resources.qubits || 1)} 
                            value={qubitAmount}
                            onChange={(e) => setQubitAmount(parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500">
                            Available: {currentPlayer?.resources.qubits} qubits
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleBuildCircuit} 
                            disabled={selectedGates.length === 0 || qubitAmount <= 0}
                            className="bg-quantum-accent w-full"
                          >
                            Build Circuit
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => endTurn()}
                            className="w-full"
                          >
                            Skip Building
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {gameState.phase === 'end' && (
                    <Button 
                      onClick={handleEndTurn}
                      className="bg-quantum-accent w-full"
                    >
                      End Turn
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
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
              {gameState.gameTiles.map((tile, i) => (
                <motion.div
                  key={tile.id}
                  className={`tile relative rounded-lg p-4 border-2 cursor-pointer transition-transform duration-300 hover:scale-105 ${tileColors[tile.type]}`}
                  variants={tileVariants}
                  initial="hidden"
                  animate={isBoardVisible ? "visible" : "hidden"}
                  custom={i}
                  onClick={() => handleTileClick(tile)}
                  whileHover={{ y: -5 }}
                  style={{ 
                    gridRow: tile.position.row + 1, 
                    gridColumn: tile.position.col + 1 
                  }}
                >
                  <h3 className="font-medium text-sm md:text-base">{tile.name}</h3>
                  <div className="text-xs mt-1 opacity-80">{tile.type}</div>
                  
                  {tile.resources && (
                    <div className="mt-2 text-xs">
                      {tile.resources.qubits > 0 && (
                        <span className="inline-block bg-white/50 rounded px-1 mr-1">
                          ⚛ {tile.resources.qubits}
                        </span>
                      )}
                      {tile.resources.energy > 0 && (
                        <span className="inline-block bg-white/50 rounded px-1">
                          ⚡ {tile.resources.energy}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Player pieces */}
            {gameState.players.map((player, index) => (
              <motion.div 
                key={player.id}
                className="absolute w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold"
                animate={{ 
                  top: `${(player.position.row) * 33.33 + 16}%`,
                  left: `${(player.position.col) * 33.33 + 16}%`,
                  y: [0, -10, 0] 
                }}
                transition={{ 
                  top: { duration: 0.5, type: 'spring' },
                  left: { duration: 0.5, type: 'spring' },
                  y: { 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.5 
                  }
                }}
                style={{ backgroundColor: player.color }}
              >
                P{index + 1}
              </motion.div>
            ))}
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
                <p className="text-foreground/70 mb-3">{selectedTile.description}</p>
                
                {selectedTile.resources && (
                  <div className="bg-white/50 rounded p-2 text-sm">
                    <strong>Available Resources:</strong>
                    <div className="mt-1">
                      {selectedTile.resources.qubits > 0 && (
                        <span className="mr-2">⚛ {selectedTile.resources.qubits} qubits</span>
                      )}
                      {selectedTile.resources.energy > 0 && (
                        <span>⚡ {selectedTile.resources.energy} energy</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Player circuits display */}
        {gameState.gameStarted && (
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-medium mb-6 text-center">Quantum Circuits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gameState.players.map((player) => (
                <div key={player.id} className="glass-card p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: player.color }}></div>
                    <h4 className="text-lg font-medium">{player.name}'s Circuits</h4>
                  </div>
                  
                  {player.circuits.length === 0 ? (
                    <p className="text-gray-500">No circuits built yet</p>
                  ) : (
                    <div className="space-y-3">
                      {player.circuits.map((circuit) => (
                        <div key={circuit.id} className="bg-white/50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium">{circuit.name}</h5>
                            <span className="text-sm">Qubits: {circuit.qubits}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {circuit.gates.map((gate, i) => {
                              const gateTile = initialGameTiles.find(t => t.id === gate);
                              return (
                                <span key={`${gate}-${i}`} className="inline-block px-2 py-1 bg-teal-100 text-xs rounded">
                                  {gateTile?.name || gate}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
