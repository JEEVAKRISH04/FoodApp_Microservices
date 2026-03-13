import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    deliveryAddress: '',
    paymentMethod: 'Card'
  });

  const token = localStorage.getItem('token');
  const userEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : null;

  useEffect(() => {
    if(!userEmail) { navigate('/login'); return; }
    const fetchCart = async () => {
      try {
        const { data } = await apiClient.get(`/cart/${userEmail}`);
        if(data.length === 0) navigate('/cart');
        setCartItems(data);
      } catch {
        console.error("Failed to load checkout details");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userEmail, navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const delivery = subtotal > 0 ? 3.99 : 0;
  const total = subtotal + tax + delivery;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setPlacingOrder(true);

    try {
      // 1. Create order
      await apiClient.post('/orders/place', {
        userEmail: userEmail,
        deliveryAddress: form.deliveryAddress,
        paymentMethod: form.paymentMethod,
        totalAmount: parseFloat(total.toFixed(2)),
        items: cartItems.map(c => ({
          menuItemId: c.menuItemId,
          name: c.name,
          price: c.price,
          quantity: c.quantity
        }))
      });

      // 2. Clear cart
      await apiClient.delete(`/cart/clear/${userEmail}`);
      
      setOrderPlaced(true);
    } catch(err) {
      alert("Failed to place order.");
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-center">Loading checkout...</div>;

  if (orderPlaced) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-20">
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <CheckCircle className="text-emerald-500 w-32 h-32 mb-6 mx-auto" />
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-4xl font-bold mb-4 text-center"
      >
        Order Confirmed!
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-gray-500 text-lg mb-8 text-center max-w-md"
      >
        Your delicious food is being prepared and will be with you shortly.
      </motion.p>
      <motion.button 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        onClick={() => navigate('/orders')} 
        className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-red-600 transition"
      >
        View Order History
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <button onClick={() => navigate('/cart')} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Cart
        </button>
        
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <form onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Delivery Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <textarea 
                      required
                      placeholder="123 Main St, Apt 4B, City"
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                      value={form.deliveryAddress}
                      onChange={e => setForm({...form, deliveryAddress: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Card', 'UPI', 'Cash on Delivery'].map(method => (
                    <div 
                      key={method}
                      onClick={() => setForm({...form, paymentMethod: method})}
                      className={`p-4 border-2 rounded-xl cursor-pointer text-center font-medium transition ${form.paymentMethod === method ? 'border-primary bg-red-50 text-primary' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={placingOrder}
                className={`w-full text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center space-x-2 shadow-xl transition ${placingOrder ? 'bg-primary/70' : 'bg-primary hover:bg-red-600 shadow-red-500/30'}`}
              >
                {placingOrder ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span>Place Order • ${total.toFixed(2)}</span>}
              </button>
            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 border-b pb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

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
              
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
