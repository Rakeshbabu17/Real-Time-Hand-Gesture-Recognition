import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HandMetal, Brain, Zap } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-16 sm:py-24">
        <motion.h1 
          className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Real-Time Hand Gesture Recognition
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Experience the future of human-computer interaction with our advanced gesture recognition technology.
          Control your digital world with natural hand movements.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/recognition"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg"
          >
            Start Recognition
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Gesture Recognition?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HandMetal className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Precise Recognition</h3>
            <p className="text-gray-600">
              Advanced algorithms ensure accurate detection of hand gestures in real-time.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Brain className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Utilizing state-of-the-art machine learning models for intelligent gesture interpretation.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Zap className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Processing</h3>
            <p className="text-gray-600">
              Instant feedback and response to your gestures with minimal latency.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 