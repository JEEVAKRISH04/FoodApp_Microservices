import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import apiClient from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const RestaurantListing = () => {
  const [restaurants, setRestaurants] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || "";
  const [search, setSearch] = useState(initialSearch);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await apiClient.get('/restaurants');
        setRestaurants(data);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(r => 
    (r.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (r.cuisineType || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Restaurants</h1>
            <p className="text-gray-500">Discover flavors from around the world</p>
          </div>
          
          <div className="w-full md:w-96 bg-white p-2 rounded-xl flex items-center shadow-sm border border-gray-100">
            <Search className="text-gray-400 ml-2 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Search restaurants or cuisines..." 
              className="flex-1 bg-transparent border-none outline-none py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl font-medium">
            No restaurants found matching "{search}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((restaurant, i) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} index={i} onClick={() => navigate(`/restaurant/${restaurant.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantListing;
