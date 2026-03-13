import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Store, Utensils } from 'lucide-react';
import apiClient from '../../services/api';

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisineType: '',
    address: '',
    imageUrl: '',
    openingHours: ''
  });

  // Adding state for menus
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuForm, setMenuForm] = useState({
    name: '', category: '', price: '', imageUrl: '', description: '', isVeg: true
  });

  const fetchRestaurants = async () => {
    try {
      const { data } = await apiClient.get('/restaurants');
      setRestaurants(data);
    } catch (err) {
      console.error('Error fetching restaurants', err);
    }
  };

  const fetchMenu = async (restaurantId) => {
    try {
      const { data } = await apiClient.get(`/menu/restaurant/${restaurantId}`);
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching menu', err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/restaurants', formData);
      setFormData({ name: '', description: '', cuisineType: '', address: '', imageUrl: '', openingHours: '' });
      fetchRestaurants();
      alert("Restaurant Added!");
    } catch (err) {
      alert("Failed to create restaurant");
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await apiClient.delete(`/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      if(!selectedRestaurant) return alert("Select a restaurant first");
      await apiClient.post('/menu', { ...menuForm, restaurantId: selectedRestaurant.id });
      setMenuForm({ name: '', category: '', price: '', imageUrl: '', description: '', isVeg: true });
      fetchMenu(selectedRestaurant.id);
      alert("Menu Item Added!");
    } catch (err) {
      alert("Failed to add menu item");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await apiClient.delete(`/menu/${id}`);
      fetchMenu(selectedRestaurant.id);
    } catch (err) {
      alert("Failed to delete menu item");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* RESTAURANT MANAGEMENT */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Store className="mr-2 text-primary" /> Manage Restaurants
          </h2>
          
          <form onSubmit={handleCreateRestaurant} className="space-y-4 mb-8">
            <input required type="text" placeholder="Restaurant Name" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
            <input required type="text" placeholder="Image URL" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.imageUrl} onChange={e=>setFormData({...formData, imageUrl: e.target.value})} />
            <input required type="text" placeholder="Cuisine Type (e.g. Italian, Indian)" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.cuisineType} onChange={e=>setFormData({...formData, cuisineType: e.target.value})} />
            <input type="text" placeholder="Address" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} />
            <textarea placeholder="Description" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
            <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium w-full hover:bg-black transition flex justify-center items-center">
              <Plus size={20} className="mr-2" /> Add Restaurant
            </button>
          </form>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {restaurants.map(rest => (
              <div key={rest.id} className={`p-4 border rounded-xl flex justify-between items-center transition cursor-pointer ${selectedRestaurant?.id === rest.id ? 'border-primary bg-red-50' : 'hover:border-gray-300'}`} onClick={() => { setSelectedRestaurant(rest); fetchMenu(rest.id); }}>
                <div className="flex items-center space-x-4">
                  <img src={rest.imageUrl} alt={rest.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold text-lg">{rest.name}</h3>
                    <p className="text-sm text-gray-500">{rest.cuisineType}</p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteRestaurant(rest.id); }} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* MENU MANAGEMENT */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-100 transition-opacity">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Utensils className="mr-2 text-primary" /> 
            Menu Items {selectedRestaurant ? `for ${selectedRestaurant.name}` : '(Select a Restaurant)'}
          </h2>
          
          <div className={!selectedRestaurant ? 'opacity-50 pointer-events-none' : ''}>
            <form onSubmit={handleCreateMenuItem} className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Item Name" className="w-full border p-3 rounded-lg outline-none" value={menuForm.name} onChange={e=>setMenuForm({...menuForm, name: e.target.value})} />
                <input required type="number" step="0.01" placeholder="Price ($)" className="w-full border p-3 rounded-lg outline-none" value={menuForm.price} onChange={e=>setMenuForm({...menuForm, price: e.target.value})} />
              </div>
              <input required type="text" placeholder="Category (e.g. Starters, Biryani)" className="w-full border p-3 rounded-lg outline-none" value={menuForm.category} onChange={e=>setMenuForm({...menuForm, category: e.target.value})} />
              <input type="text" placeholder="Image URL" className="w-full border p-3 rounded-lg outline-none" value={menuForm.imageUrl} onChange={e=>setMenuForm({...menuForm, imageUrl: e.target.value})} />
              <div className="flex items-center space-x-2 p-2">
                <input type="checkbox" id="veg" checked={menuForm.isVeg} onChange={e=>setMenuForm({...menuForm, isVeg: e.target.checked})} className="w-5 h-5 accent-emerald-500" />
                <label htmlFor="veg" className="font-medium">Vegetarian / Vegan</label>
              </div>
              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-medium w-full hover:bg-red-600 transition flex justify-center items-center">
                <Plus size={20} className="mr-2" /> Add Menu Item
              </button>
            </form>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {menuItems.map(item => (
                <div key={item.id} className="p-4 border rounded-xl flex justify-between items-center bg-gray-50">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <h3 className="font-bold">{item.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{item.category} • ${item.price}</p>
                  </div>
                  <button onClick={() => handleDeleteMenuItem(item.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {menuItems.length === 0 && selectedRestaurant && <p className="text-gray-500 text-center py-4">No menu items found. Add some!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
