
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our game
export interface GameTile {
  id: string;
  name: string;
  type: 'planet' | 'gate' | 'resource' | 'hazard';
  description: string;
  position: { row: number; col: number };
  resources?: { qubits?: number; energy?: number; };
}

interface Player {
  id: string;
  name: string;
  color: string;
  position: { row: number; col: number };
  resources: {
    qubits: number;
    energy: number;
  };
  gates: string[];
  circuits: Circuit[];
}

interface Circuit {
  id: string;
  name: string;
  gates: string[];
  qubits: number;
  completed: boolean;
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  gameTiles: GameTile[];
  turn: number;
  phase: 'movement' | 'action' | 'build' | 'end';
  gameStarted: boolean;
  winner: string | null;
}

interface GameContextType {
  gameState: GameState;
  startGame: (playerNames: string[]) => void;
  movePlayer: (row: number, col: number) => void;
  collectResource: (tileId: string) => void;
  buildCircuit: (gates: string[], qubits: number) => void;
  acquireGate: (gateId: string) => void;
  endTurn: () => void;
  resetGame: () => void;
}

// Initial game tiles with positions
export const initialGameTiles: GameTile[] = [
  { 
    id: 'hadamard', 
    name: 'Hadamard Gate', 
    type: 'gate', 
    description: 'Creates superposition from a single qubit',
    position: { row: 0, col: 0 }
  },
  { 
    id: 'cnot', 
    name: 'CNOT Gate', 
    type: 'gate', 
    description: 'Entangles two qubits',
    position: { row: 0, col: 2 }
  },
  { 
    id: 'merge', 
    name: 'Entanglement Sector', 
    type: 'planet', 
    description: 'A region where quantum entanglement is easy to achieve',
    position: { row: 1, col: 1 },
    resources: { qubits: 2, energy: 1 }
  },
  { 
    id: 'quarks', 
    name: 'Quark Repository', 
    type: 'resource', 
    description: 'Collect quantum building blocks',
    position: { row: 2, col: 0 },
    resources: { qubits: 3, energy: 0 }
  },
  { 
    id: 'decoherence', 
    name: 'Decoherence Zone', 
    type: 'hazard', 
    description: 'Your qubits may lose coherence here',
    position: { row: 1, col: 2 }
  },
  { 
    id: 'toffoli', 
    name: 'Toffoli Gate', 
    type: 'gate', 
    description: 'Three-qubit gate for advanced operations',
    position: { row: 2, col: 2 }
  },
  { 
    id: 'strangelet', 
    name: 'Strangelet Belt', 
    type: 'hazard', 
    description: 'Navigate carefully through this quantum anomaly',
    position: { row: 0, col: 1 }
  },
  { 
    id: 'quantum-foam', 
    name: 'Quantum Foam', 
    type: 'resource', 
    description: 'Harness the energy of space-time fluctuations',
    position: { row: 2, col: 1 },
    resources: { qubits: 1, energy: 2 }
  },
];

// Initial game state
const initialGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  gameTiles: initialGameTiles,
  turn: 1,
  phase: 'movement',
  gameStarted: false,
  winner: null
};

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Start a new game with the given player names
  const startGame = (playerNames: string[]) => {
    const playerColors = ['#7F5AF0', '#00BCD4', '#FF5722', '#8BC34A'];
    
    const players = playerNames.map((name, index) => ({
      id: `player-${index + 1}`,
      name,
      color: playerColors[index % playerColors.length],
      position: { row: 1, col: 1 }, // All players start at the center
      resources: {
        qubits: 5,
        energy: 5
      },
      gates: [],
      circuits: []
    }));

    setGameState({
      ...initialGameState,
      players,
      gameStarted: true
    });
  };

  // Move the current player to the specified position
  const movePlayer = (row: number, col: number) => {
    if (gameState.phase !== 'movement' || !gameState.gameStarted) return;

    // Check if move is valid (adjacent to current position)
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const { row: currentRow, col: currentCol } = currentPlayer.position;
    
    const isAdjacent = 
      (Math.abs(row - currentRow) <= 1 && Math.abs(col - currentCol) <= 1) &&
      (row !== currentRow || col !== currentCol);
    
    if (!isAdjacent) return;
    
    // Move player
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = {
      ...currentPlayer,
      position: { row, col }
    };
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: 'action'
    });
  };

  // Collect resources from the current tile
  const collectResource = (tileId: string) => {
    if (gameState.phase !== 'action' || !gameState.gameStarted) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentPosition = currentPlayer.position;
    
    // Find tile at player's position
    const tile = gameState.gameTiles.find(
      t => t.id === tileId && 
      t.position.row === currentPosition.row && 
      t.position.col === currentPosition.col
    );
    
    // If no tile or no resources to collect
    if (!tile || !tile.resources) return;
    
    // Update player resources
    const updatedPlayers = [...gameState.players];
    const playerToUpdate = updatedPlayers[gameState.currentPlayerIndex];
    
    updatedPlayers[gameState.currentPlayerIndex] = {
      ...playerToUpdate,
      resources: {
        qubits: playerToUpdate.resources.qubits + (tile.resources.qubits || 0),
        energy: playerToUpdate.resources.energy + (tile.resources.energy || 0)
      }
    };
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: 'build'
    });
  };

  // Acquire a gate
  const acquireGate = (gateId: string) => {
    if (gameState.phase !== 'action' || !gameState.gameStarted) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const currentPosition = currentPlayer.position;
    
    // Find gate at player's position
    const gate = gameState.gameTiles.find(
      t => t.id === gateId && 
      t.type === 'gate' &&
      t.position.row === currentPosition.row && 
      t.position.col === currentPosition.col
    );
    
    if (!gate) return;
    
    // Check if player has enough resources (gates cost energy)
    if (currentPlayer.resources.energy < 2) return;
    
    // Update player gates and resources
    const updatedPlayers = [...gameState.players];
    const playerToUpdate = updatedPlayers[gameState.currentPlayerIndex];
    
    updatedPlayers[gameState.currentPlayerIndex] = {
      ...playerToUpdate,
      gates: [...playerToUpdate.gates, gate.id],
      resources: {
        ...playerToUpdate.resources,
        energy: playerToUpdate.resources.energy - 2
      }
    };
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: 'build'
    });
  };

  // Build a quantum circuit
  const buildCircuit = (gates: string[], qubits: number) => {
    if (gameState.phase !== 'build' || !gameState.gameStarted) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Check if player has the gates and enough qubits
    const hasGates = gates.every(gate => currentPlayer.gates.includes(gate));
    if (!hasGates || currentPlayer.resources.qubits < qubits) return;
    
    // Create new circuit
    const newCircuit: Circuit = {
      id: `circuit-${Date.now()}`,
      name: `Circuit ${currentPlayer.circuits.length + 1}`,
      gates,
      qubits,
      completed: true
    };
    
    // Update player circuits and resources
    const updatedPlayers = [...gameState.players];
    const playerToUpdate = updatedPlayers[gameState.currentPlayerIndex];
    
    // Remove used gates from player's inventory
    const remainingGates = playerToUpdate.gates.filter(
      gate => !gates.includes(gate) || 
      playerToUpdate.gates.indexOf(gate) > gates.lastIndexOf(gate)
    );
    
    updatedPlayers[gameState.currentPlayerIndex] = {
      ...playerToUpdate,
      circuits: [...playerToUpdate.circuits, newCircuit],
      gates: remainingGates,
      resources: {
        ...playerToUpdate.resources,
        qubits: playerToUpdate.resources.qubits - qubits
      }
    };
    
    // Check win condition (3 completed circuits)
    const hasWon = updatedPlayers[gameState.currentPlayerIndex].circuits.length >= 3;
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: 'end',
      winner: hasWon ? currentPlayer.name : null
    });
  };

  // End the current player's turn
  const endTurn = () => {
    if (!gameState.gameStarted) return;
    
    // Move to the next player
    const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    setGameState({
      ...gameState,
      currentPlayerIndex: nextPlayerIndex,
      phase: 'movement',
      turn: nextPlayerIndex === 0 ? gameState.turn + 1 : gameState.turn
    });
  };

  // Reset the game
  const resetGame = () => {
    setGameState(initialGameState);
  };

  return (
    <GameContext.Provider value={{
      gameState,
      startGame,
      movePlayer,
      collectResource,
      buildCircuit,
      acquireGate,
      endTurn,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
