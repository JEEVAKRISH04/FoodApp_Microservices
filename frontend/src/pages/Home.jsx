import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import apiClient from '../services/api';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await apiClient.get('/restaurants');
        // Get up to 10
        setRestaurants(data.slice(0, 10));
      } catch (err) {
        console.error("Failed to load featured", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Savor the flavors that <br/><span className="text-primary italic">inspire</span> you.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Discover top-rated restaurants, fast delivery, and the best culinary experiences in your city.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-white p-2 rounded-full flex items-center shadow-2xl max-w-2xl mx-auto"
          >
            <div className="pl-6 pr-4 text-gray-400">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Search for restaurants, cuisines, or dishes..." 
              className="flex-1 bg-transparent border-none outline-none text-gray-800 text-lg py-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/restaurants?search=${searchTerm}`)}
            />
            <button onClick={() => navigate(`/restaurants?search=${searchTerm}`)} className="bg-primary text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-600 transition flex items-center shadow-lg shadow-red-500/40">
              Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-4"
              >
                Featured Restaurants
              </motion.h2>
              <p className="text-gray-500 text-lg">Hand-picked places to satisfy your cravings</p>
            </div>
            <button onClick={() => navigate('/restaurants')} className="hidden md:flex items-center text-primary font-bold hover:text-red-700 transition">
              View All <ChevronRight className="ml-1" size={20} />
            </button>
          </div>
          
          {restaurants.length === 0 ? (
            <div className="text-center py-10 text-xl text-gray-500">No restaurants available right now.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {restaurants.map((restaurant, i) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} index={i} onClick={() => navigate(`/restaurant/${restaurant.id}`)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
