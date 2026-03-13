import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UtensilsCrossed, ShoppingCart, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantListing from './pages/RestaurantListing';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';

function App() {
  const token = localStorage.getItem('token');
  const role = token ? JSON.parse(atob(token.split('.')[1])).role : null;
  const isAdmin = role === 'ROLE_ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="fixed w-full z-50 glassmorphism transition-all duration-300">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-primary">
              <UtensilsCrossed size={32} />
              <span className="text-2xl font-['Outfit'] font-extrabold tracking-tighter">Gourmet</span>
            </Link>
            <nav className="hidden md:flex space-x-8 font-medium">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link>
              <Link to="/orders" className="hover:text-primary transition-colors">Orders</Link>
              {isAdmin && <Link to="/admin" className="hover:text-primary transition-colors text-red-600 font-bold">Admin Panel</Link>}
            </nav>
            <div className="flex space-x-4 items-center">
              <Link to="/cart" className="p-2 rounded-full bg-gray-100 hover:bg-red-50 hover:text-primary transition relative group">
                <ShoppingCart size={20} />
              </Link>
              {token ? (
                <button onClick={handleLogout} className="hidden md:flex items-center space-x-2 bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-black transition shadow-lg">
                  <span>Logout</span>
                </button>
              ) : (
                <Link to="/login" className="hidden md:flex items-center space-x-2 bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-red-600 transition shadow-lg shadow-red-500/30">
                  <User size={18} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow pt-24">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/restaurants" element={<RestaurantListing />} />
              <Route path="/restaurant/:id" element={<RestaurantMenu />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <div className="text-center py-20 text-2xl font-bold">Unauthorized. Admins Only.</div>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              {/* Other routes will be lazily loaded or imported here */}
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; {new Date().getFullYear()} Gourmet Food Delivery. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
