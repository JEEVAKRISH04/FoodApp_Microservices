import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Utensils } from 'lucide-react';
import apiClient from '../services/api';

const RestaurantCard = ({ restaurant, index, onClick }) => {
  const [previewDishes, setPreviewDishes] = useState([]);

  useEffect(() => {
    // Optionally fetch 3 dishes if we want to show previews on the card as requested
    const fetchDishes = async () => {
      try {
        const { data } = await apiClient.get(`/menu/restaurant/${restaurant.id}`);
        setPreviewDishes(data.slice(0, 3));
      } catch(err) {}
    };
    fetchDishes();
  }, [restaurant.id]);

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden shrink-0">
        <img 
          src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold flex items-center shadow-lg">
          <Star className="text-yellow-400 w-4 h-4 mr-1 fill-current" />
          {restaurant.rating || "New"}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {restaurant.name}
        </h3>
        
        <div className="text-gray-500 text-sm mb-4 line-clamp-1">
          {restaurant.cuisineType}
        </div>

        {/* 3 dishes preview as requested */}
        {previewDishes.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 flex-1">
            <div className="font-semibold mb-1 flex items-center text-xs text-gray-400 uppercase tracking-wider"><Utensils size={12} className="mr-1"/> Featured</div>
            <ul className="list-disc pl-4 space-y-1">
              {previewDishes.map(d => (
                <li key={d.id} className="truncate">{d.name}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-4 mt-auto">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-primary" />
            <span>{restaurant.openingHours || "10 AM - 10 PM"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
