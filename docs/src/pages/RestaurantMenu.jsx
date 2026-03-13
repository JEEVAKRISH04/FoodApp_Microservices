import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Plus, Minus, Search } from 'lucide-react';
import apiClient from '../services/api';
// We'll dispatch to Redux here later, but for UI implementation we will mock cart behavior internally first.

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  
  const token = localStorage.getItem('token');
  const userEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, menuRes] = await Promise.all([
          apiClient.get(`/restaurants/${id}`),
          apiClient.get(`/menu/restaurant/${id}`)
        ]);
        setRestaurant(restRes.data);
        setMenuItems(menuRes.data);
      } catch (err) {
        console.error("Failed to load restaurant details", err);
      }
    };
    fetchData();
  }, [id]);

  if(!restaurant) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Group by category smartly
  const filteredNav = menuItems.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const categories = [...new Set(filteredNav.map(m => m.category || "Other"))];

  const handleAddToCart = async (item) => {
    if (!userEmail) {
      alert("Please login to add items to cart!");
      navigate('/login');
      return;
    }
    
    try {
      await apiClient.post('/cart/add', {
        userEmail: userEmail,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl
      });
      alert(`Added ${item.name} to Cart!`);
    } catch(err) {
      alert("Couldn't add item to Cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Restaurant Header */}
      <div className="bg-gray-900 text-white pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&w=2000&q=80"} alt="" className="w-full h-full object-cover blur-sm" />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
          <img src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&w=800"} alt="Logo" className="w-40 h-40 rounded-2xl object-cover shadow-2xl border-4 border-white/10" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-xl text-gray-300 mb-4">{restaurant.cuisineType}</p>
            <div className="flex items-center justify-center md:justify-start space-x-6 text-sm font-medium">
              <span className="flex items-center bg-white/20 px-3 py-1.5 rounded-full"><Star className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor"/> {restaurant.rating || "New"}</span>
              <span className="flex items-center bg-white/20 px-3 py-1.5 rounded-full"><Clock className="w-4 h-4 mr-1 text-emerald-400" /> {restaurant.openingHours || "Open"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Sidebar categories */}
        <div className="hidden lg:block space-y-2 sticky top-28 h-max">
           <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2">Categories</h3>
           {categories.map(c => (
              <a href={`#category-${c}`} key={c} className="block py-2 text-gray-600 hover:text-primary transition-colors font-medium">{c}</a>
           ))}
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-3 space-y-12">
           <div className="flex items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-8">
             <Search className="text-gray-400 ml-3 mr-2" size={20} />
             <input type="text" placeholder="Search menu items..." className="flex-1 outline-none py-2 bg-transparent" value={search} onChange={e=>setSearch(e.target.value)} />
           </div>

           {categories.map((cat, i) => (
             <div key={cat} id={`category-${cat}`} className="scroll-mt-32">
               <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">{cat}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {filteredNav.filter(m => (m.category || "Other") === cat).map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index*0.05 }}
                      key={item.id} 
                      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-3 h-3 rounded-md ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                          </div>
                          <p className="text-gray-500 text-sm line-clamp-2 mt-1 min-h-[40px]">{item.description || "Fresh and delicious"}</p>
                          <p className="font-bold text-gray-900 mt-2">${item.price.toFixed(2)}</p>
                        </div>
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-28 h-28 object-cover rounded-xl shadow-sm shrink-0" />
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-gray-50 flex justify-end">
                        <button onClick={()=>handleAddToCart(item)} className="bg-white border-2 border-primary text-primary px-6 py-2 rounded-xl font-bold hover:bg-red-50 transition shadow-sm">
                          ADD TO CART
                        </button>
                      </div>
                    </motion.div>
                 ))}
               </div>
             </div>
           ))}
           {categories.length === 0 && <p className="text-gray-500">No items found.</p>}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
