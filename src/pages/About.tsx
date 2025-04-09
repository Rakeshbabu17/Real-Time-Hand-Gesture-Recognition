import { motion } from 'framer-motion';
import { Code2, Brain, Cpu } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-16">
        <motion.h1
          className="text-4xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Hand Gesture Technology
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover how we're revolutionizing human-computer interaction through advanced gesture recognition technology.
        </motion.p>
      </div>

      {/* Technology Stack */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Technology Stack</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <Code2 className="h-6 w-6 text-primary-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">TensorFlow.js</h3>
              <p className="text-gray-600">
                We utilize TensorFlow.js for running machine learning models directly in your browser,
                ensuring fast and private gesture processing without server delays.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Brain className="h-6 w-6 text-primary-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">MediaPipe</h3>
              <p className="text-gray-600">
                Google's MediaPipe framework powers our hand tracking system, providing accurate
                real-time detection of hand landmarks and gestures.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <Cpu className="h-6 w-6 text-primary-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Processing</h3>
              <p className="text-gray-600">
                1. Your webcam captures video input in real-time<br />
                2. MediaPipe detects and tracks hand landmarks<br />
                3. Our ML model analyzes the landmark patterns<br />
                4. Gestures are recognized and displayed instantly
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 