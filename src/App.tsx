/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import { Trophy, LogIn, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function Navbar({ user }: { user: User | null }) {
  const provider = new GoogleAuthProvider();
  
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 md:px-8 justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-orange-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
          <Trophy className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900">Kanak Hulu <span className="text-orange-500">2026</span></span>
      </Link>
      
      <div className="flex items-center gap-4">
        <Link to="/" className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
          <Home size={18} /> Home
        </Link>
        {user ? (
          <>
            <Link to="/admin" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
              <LayoutDashboard size={18} /> Admin
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
            {user.photoURL && (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
            )}
          </>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <LogIn size={18} /> Admin Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Trophy className="w-12 h-12 text-orange-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar user={user} />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={user ? <AdminDashboard user={user} /> : <div className="p-20 text-center">Please login as admin.</div>} />
          </Routes>
        </main>
        
        <footer className="bg-gray-900 text-white py-12 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-2xl tracking-tight">Kanak Hulu <span className="text-orange-500">2026</span></span>
              <p className="text-gray-400 text-sm max-w-xs">Portal resmi turnamen futsal Kanak Hulu - Membangun sportivitas dan persaudaraan melalui olahraga.</p>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Navigasi</span>
                <Link to="/" className="text-sm hover:text-orange-500 transition-colors">Beranda</Link>
                <Link to="/admin" className="text-sm hover:text-orange-500 transition-colors">Admin Panel</Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Kontak</span>
                <span className="text-sm text-gray-400">info@kanakhulu.com</span>
                <span className="text-sm text-gray-400">+62 812 3456 7890</span>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
            &copy; 2026 Turnamen Futsal Kanak Hulu. All rights reserved.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
