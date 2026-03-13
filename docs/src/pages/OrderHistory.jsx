import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : null;

  useEffect(() => {
    if(!userEmail) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get(`/orders/${userEmail}`);
        setOrders(data);
      } catch {
        console.error("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userEmail, navigate]);

  const getStatusConfig = (status) => {
    switch(status?.toUpperCase()) {
      case 'DELIVERED': return { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle };
      case 'CANCELLED': return { color: 'text-red-500', bg: 'bg-red-50', icon: XCircle };
      case 'PREPARING':
      default: return { color: 'text-orange-500', bg: 'bg-orange-50', icon: Clock };
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Order History</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
             <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-500 mb-4">No past orders found</h2>
            <button onClick={() => navigate('/restaurants')} className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-red-600 transition shadow-lg shadow-red-500/30">
              Order Food Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, i) => {
              const StatusConfig = getStatusConfig(order.status);
              const Icon = StatusConfig.icon;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={order.id} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1 font-medium">Order #{order.id} • {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}</p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${StatusConfig.bg} ${StatusConfig.color}`}>
                        <Icon size={16} className="mr-1.5" />
                        {order.status}
                      </div>
                    </div>
                    <div className="text-left md:text-right w-full md:w-auto">
                      <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                       <div key={index} className="flex justify-between items-center text-gray-700">
                         <div className="flex items-center">
                           <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded mr-3 text-sm">{item.quantity}x</span>
                           <span className="font-medium">{item.name}</span>
                         </div>
                         <span>${(item.price * item.quantity).toFixed(2)}</span>
                       </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-dashed flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
                     <p><span className="font-medium text-gray-700">Delivering to:</span> {order.deliveryAddress}</p>
                     <p><span className="font-medium text-gray-700">Payment:</span> {order.paymentMethod}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
