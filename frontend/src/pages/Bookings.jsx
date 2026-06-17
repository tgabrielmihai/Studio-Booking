import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Bookings = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState('');
  const [studioRoom, setStudioRoom] = useState('Vocal Booth');
  const [availableGear, setAvailableGear] = useState([]);
  const [selectedGear, setSelectedGear] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const roomPrices = { 'Vocal Booth': 50, 'Mixing Room A': 80, 'Live Recording Room': 150 };

  useEffect(() => {
    const fetchGear = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/gear');
        setAvailableGear(response.data);
      } catch (error) { console.error('Eroare:', error); }
    };
    fetchGear();
  }, []);

  useEffect(() => {
    const roomCost = roomPrices[studioRoom] || 0;
    const gearCost = selectedGear.reduce((sum, gearName) => {
      const gearItem = availableGear.find(g => g.name === gearName);
      return sum + (gearItem ? (gearItem.price || 50) : 0);
    }, 0);
    setTotalPrice(roomCost + gearCost);
  }, [studioRoom, selectedGear, availableGear]);

  const handleGearToggle = (gearName) => {
    setSelectedGear(prev => prev.includes(gearName) ? prev.filter(name => name !== gearName) : [...prev, gearName]);
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert('Autentifică-te!'); return; }
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      
      await axios.post('http://localhost:3000/api/bookings', 
        { date, room: studioRoom, price: totalPrice, userId: payload.sub },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert(`Checkout reușit! ${totalPrice} RON.`);
      navigate('/my-sessions');
    } catch  { alert('Eroare la rezervare.'); }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h2 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-600">
        Studio Booking & Checkout
      </h2>
      
      {/* Progress Bar */}
      <div className="flex justify-between mb-8 text-sm font-semibold">
        {['Room & Date', 'Gear', 'Checkout'].map((step, i) => (
          <span key={i} className={currentStep >= i + 1 ? 'text-purple-400' : 'text-gray-500'}>
            {i + 1}. {step}
          </span>
        ))}
      </div>

      {/* Main Container Glassmorphism */}
      <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
        
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Select Date & Room</h3>
            <div>
              <label className="block text-gray-400 mb-2">Select Date:</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} 
                className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Studio Room:</label>
              <select value={studioRoom} onChange={(e) => setStudioRoom(e.target.value)} 
                className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500">
                {Object.keys(roomPrices).map(room => <option key={room} value={room}>{room} ({roomPrices[room]} RON)</option>)}
              </select>
            </div>
            <button onClick={() => date ? setCurrentStep(2) : alert('Selectează data!')} 
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 p-3 rounded-lg font-bold hover:scale-[1.02] transition-transform">Next</button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Select Additional Gear</h3>
            <div className="grid gap-4">
              {availableGear.map(gear => (
                <label key={gear.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10">
                  <input type="checkbox" checked={selectedGear.includes(gear.name)} onChange={() => handleGearToggle(gear.name)} className="accent-purple-500 w-5 h-5" />
                  {gear.imageUrl && <img src={gear.imageUrl} className="w-12 h-12 rounded-lg object-cover" />}
                  <span>{gear.name} ({gear.price || 50} RON)</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setCurrentStep(1)} className="flex-1 bg-gray-700 p-3 rounded-lg">Back</button>
              <button onClick={() => setCurrentStep(3)} className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 p-3 rounded-lg font-bold">Review</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Order Summary</h3>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <p>Date: {date}</p>
              <p>Room: {studioRoom} ({roomPrices[studioRoom]} RON)</p>
              <p>Gear: {selectedGear.join(', ') || 'None'}</p>
            </div>
            <h2 className="text-3xl font-bold text-green-400">Total: {totalPrice} RON</h2>
            <div className="flex gap-4">
              <button onClick={handleCheckout} className="flex-1 bg-green-600 p-3 rounded-lg font-bold hover:bg-green-700">Confirm & Pay</button>
              <button onClick={() => setCurrentStep(2)} className="flex-1 bg-gray-700 p-3 rounded-lg">Edit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;