
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';

const About = () => {
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
            About <span className="text-quantum-accent">Entanglion</span>
          </motion.h1>
          <motion.p 
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            The journey behind our quantum computing board game
          </motion.p>
        </div>
        
        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium mb-6 text-quantum-accent">The Quantum Challenge</h2>
            <div className="glass-card p-8 rounded-xl prose prose-gray max-w-none">
              <p>
                Quantum computing is a fascinating but complex field that combines physics, mathematics, and computer science. 
                The abstract nature of quantum mechanics—with principles like superposition, entanglement, and quantum interference—makes
                it challenging for newcomers to develop an intuition for how quantum computing works.
              </p>
              <p>
                Entanglion was designed to bridge this gap by translating these complex concepts into an engaging, hands-on
                board game experience. By physically manipulating game pieces and making strategic decisions, players can develop
                an intuitive understanding of quantum principles without requiring advanced mathematics.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium mb-6 text-quantum-accent">Educational Foundation</h2>
            <div className="glass-card p-8 rounded-xl prose prose-gray max-w-none">
              <p>
                At its core, Entanglion is based on real quantum computing principles. The game board represents a quantum universe
                where players navigate their spaceships to collect quantum gates—the building blocks of quantum circuits.
              </p>
              <p>
                Each gate in the game corresponds to a real quantum gate used in quantum computing:
              </p>
              <ul>
                <li>The Hadamard (H) gate creates superposition</li>
                <li>The CNOT gate entangles qubits</li>
                <li>The Phase (S) and T gates enable quantum interference</li>
                <li>Measurement operations collapse quantum states</li>
              </ul>
              <p>
                By playing Entanglion, you'll develop an understanding of these components and how they interact to create
                quantum algorithms—all while having fun with friends and family!
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium mb-6 text-quantum-accent">Design Philosophy</h2>
            <div className="glass-card p-8 rounded-xl prose prose-gray max-w-none">
              <p>
                Entanglion was designed with several key principles in mind:
              </p>
              <ol>
                <li>
                  <strong>Accessibility:</strong> Making quantum computing concepts approachable without requiring advanced physics or mathematics.
                </li>
                <li>
                  <strong>Accuracy:</strong> Ensuring that the game mechanics reflect actual quantum computing principles and operations.
                </li>
                <li>
                  <strong>Engagement:</strong> Creating a fun, strategic game experience that stands on its own merits while teaching.
                </li>
                <li>
                  <strong>Balance:</strong> Providing enough complexity to reflect quantum computing while remaining playable and enjoyable.
                </li>
              </ol>
              <p>
                The result is a game that serves as both entertainment and an educational tool, opening the door to quantum
                computing for curious minds of all backgrounds.
              </p>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-foreground/70 mb-6">Ready to start your quantum journey?</p>
          <a 
            href="/rules" 
            className="px-8 py-3 rounded-full bg-quantum-accent text-white font-medium tracking-wide hover:bg-quantum-accent-light transition-colors duration-300 inline-flex items-center shadow-lg shadow-quantum-accent/20 mr-4"
          >
            View Game Rules
          </a>
          <a 
            href="/" 
            className="px-8 py-3 rounded-full bg-transparent border border-quantum-accent text-quantum-accent font-medium tracking-wide hover:bg-quantum-accent/5 transition-colors duration-300 inline-flex items-center"
          >
            Return Home
          </a>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default About;
