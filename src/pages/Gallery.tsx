import { motion } from 'framer-motion';

interface GestureItem {
  id: number;
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'custom';
  image: string;
}

const gestures: GestureItem[] = [
  {
    id: 1,
    name: 'Pointing',
    description: 'Extend your index finger upward with a surprised expression',
    category: 'basic',
    image: '/gestures/point-up.png'
  },
  {
    id: 2,
    name: 'Dis-Like',
    description: 'show a thumbs down with a sad expression',
    category: 'basic',
    image: '/gestures/ok-sign.png'
  },
  {
    id: 3,
    name: 'Like',
    description: 'Show a thumbs up with a big smile',
    category: 'basic',
    image: '/gestures/thumbs-up.png'
  },
  {
    id: 4,
    name: 'Victory',
    description: 'Form a V shape with index and middle fingers with a cheerful smile',
    category: 'basic',
    image: '/gestures/R.png'
  },
  {
    id: 5,
    name: 'Hello',
    description: 'Show your palm with fingers spread',
    category: 'basic',
    image: '/gestures/open-palm.png'
  },
  
];

export function Gallery() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-16">
        <motion.h1
          className="text-4xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Gesture Gallery
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore our collection of recognizable gestures and learn how to perform them.
        </motion.p>

        {/* Gesture Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gestures.map((gesture, index) => (
            <motion.div
              key={gesture.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img
                  src={gesture.image}
                  alt={gesture.name}
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=Gesture+Image';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{gesture.name}</h3>
                <p className="text-gray-600">{gesture.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 