import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // For this demo, we infer the user's email from their JWT Token
  const token = localStorage.getItem('token');
  const userEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : null;

  useEffect(() => {
    if(!userEmail) { navigate('/login'); return; }
    fetchCart();
  }, [userEmail, navigate]);

  const fetchCart = async () => {
    try {
      const { data } = await apiClient.get(`/cart/${userEmail}`);
      setCartItems(data);
    } catch {
      console.error("Cart loading failed");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, currentQty, change) => {
    const nextQty = currentQty + change;
    if (nextQty <= 0) return removeItem(id);
    
    try {
      await apiClient.put(`/cart/update/${id}?quantity=${nextQty}`);
      fetchCart();
    } catch {
      alert("Failed to update item");
    }
  };

  const removeItem = async (id) => {
    try {
      await apiClient.delete(`/cart/remove/${id}`);
      fetchCart();
    } catch {
      alert("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    // Basic navigation guard check
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const delivery = subtotal > 0 ? 3.99 : 0;
  const total = subtotal + tax + delivery;

  if(loading) return <div className="min-h-screen pt-24 text-center">Loading cart...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
            <button onClick={() => navigate('/restaurants')} className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-red-600 transition shadow-lg shadow-red-500/30">
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items List */}
            <div className="lg:w-2/3 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.id} 
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150"} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                      <button onClick={()=>updateQuantity(item.id, item.quantity, -1)} className="p-2.5 text-gray-600 hover:bg-gray-200 transition"><Minus size={16}/></button>
                      <span className="w-8 text-center font-bold text-sm tracking-wide">{item.quantity}</span>
                      <button onClick={()=>updateQuantity(item.id, item.quantity, 1)} className="p-2.5 text-primary hover:bg-red-50 transition"><Plus size={16}/></button>
                    </div>
                    
                    <button onClick={()=>removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition p-2">
                      <Trash2 size={22} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-3 text-gray-600 mb-6 border-b pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-gray-900">${delivery.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black text-gray-900">${total.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout} 
                  className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition flex items-center justify-center space-x-2 shadow-xl"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
