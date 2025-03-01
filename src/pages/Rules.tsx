
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { useStaggeredAnimation } from '@/lib/animations';

const Rules = () => {
  const staggeredRules = useStaggeredAnimation(8, 100, 300);
  
  const rules = [
    {
      title: "Game Setup",
      content: "Place the game board in the center of the table. Each player chooses a quantum spaceship and places it on the start position. Shuffle the Quantum Event cards and place them face down next to the board."
    },
    {
      title: "Game Objective",
      content: "Be the first player to build a functional quantum computer by collecting quantum gates and navigating the quantum universe while managing the challenges of quantum phenomena."
    },
    {
      title: "Turn Structure",
      content: "On your turn, roll the quantum dice to determine your movement. Move your quantum spaceship and perform the action of the space you land on. Draw a Quantum Event card if required."
    },
    {
      title: "Collecting Gates",
      content: "Land on a Gate space to collect that quantum gate for your computer. Each gate has specific properties and effects on your quantum circuit."
    },
    {
      title: "Quantum Phenomena",
      content: "Quantum Event cards introduce random quantum phenomena that may help or hinder your progress. These represent real quantum computing challenges like decoherence, interference, and entanglement."
    },
    {
      title: "Building Your Quantum Computer",
      content: "As you collect gates, strategically place them on your Quantum Circuit board. Different combinations of gates allow you to perform increasingly complex algorithms."
    },
    {
      title: "Quantum Algorithms",
      content: "Complete specific gate combinations to execute quantum algorithms. Each completed algorithm provides special abilities or victory points."
    },
    {
      title: "Winning the Game",
      content: "The first player to build a complete quantum computer (as specified in the scenario card) and execute a specified algorithm wins the game!"
    }
  ];
  
  return (
    <Layout>
      <motion.div 
        className="max-w-4xl mx-auto px-6 lg:px-10 pt-6 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-6xl font-medium mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Game <span className="text-quantum-accent">Rules</span>
          </motion.h1>
          <motion.p 
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Learn how to play Entanglion and explore the quantum universe
          </motion.p>
        </div>
        
        <div className="space-y-8">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              className="glass-card p-8 rounded-xl hover-elevation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: staggeredRules[index] ? 1 : 0, y: staggeredRules[index] ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4 w-8">
                  <div className="w-8 h-8 rounded-full bg-quantum-accent/20 text-quantum-accent flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3">{rule.title}</h3>
                  <p className="text-foreground/70">{rule.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="text-foreground/70 mb-6">Ready to embark on your quantum adventure?</p>
          <a 
            href="/" 
            className="px-8 py-3 rounded-full bg-quantum-accent text-white font-medium tracking-wide hover:bg-quantum-accent-light transition-colors duration-300 inline-flex items-center shadow-lg shadow-quantum-accent/20"
          >
            Return to Home
          </a>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Rules;
