import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HandMetal, Info, Image } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <HandMetal className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Hand Gesture</span>
          </Link>
          
          <ul className="flex space-x-8">
            <li>
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/gallery" 
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <Image className="h-4 w-4" />
                <span>Gallery</span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2025 Hand Gesture Recognition. All rights reserved.
            <p>Rakesh & Team</p>
          </p>
          
        </div>
      </footer>
    </div>
  );
} 