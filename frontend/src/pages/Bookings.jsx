import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Bookings = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState('');
  const [studioRoom, setStudioRoom] = useState('Vocal Booth');
  
  // Starea pentru echipamentele trase din baza de date
  const [availableGear, setAvailableGear] = useState([]);
  const [selectedGear, setSelectedGear] = useState([]);
  
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const roomPrices = {
    'Vocal Booth': 50,
    'Mixing Room A': 80,
    'Live Recording Room': 150
  };

  // 1. Tragem echipamentele din baza de date la încărcare
  useEffect(() => {
    const fetchGear = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/gear');
        setAvailableGear(response.data);
      } catch (error) {
        console.error('Eroare la extragerea echipamentelor:', error);
      }
    };
    fetchGear();
  }, []);

  // 2. Calculăm prețul total (Cameră + Prețul fiecărui echipament selectat)
  useEffect(() => {
    const roomCost = roomPrices[studioRoom] || 0;
    
    // Calculăm prețul echipamentelor bifate
    const gearCost = selectedGear.reduce((sum, gearName) => {
      const gearItem = availableGear.find(g => g.name === gearName);
      return sum + (gearItem ? (gearItem.price || 50) : 0);
    }, 0);

    setTotalPrice(roomCost + gearCost);
  }, [studioRoom, selectedGear, availableGear]);

  const handleGearToggle = (gearName) => {
    setSelectedGear(prev => 
      prev.includes(gearName) ? prev.filter(name => name !== gearName) : [...prev, gearName]
    );
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  // 3. Trimiterea rezervării către Backend
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token'); 
      await axios.post('http://localhost:3000/api/bookings', {
        date: date,
        room: studioRoom,
        price: totalPrice
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert(`Checkout successful! ${totalPrice} RON charged to your account.`);
      setCurrentStep(1);
      setSelectedGear([]);
      setDate('');
      navigate('/my-sessions');
    } catch (error) {
      alert('Eroare la salvarea rezervării. Asigură-te că ești logat.');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Studio Booking & Checkout</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold' }}>
        <span style={{ color: currentStep >= 1 ? '#007bff' : '#ccc' }}>1. Room & Date</span>
        <span style={{ color: currentStep >= 2 ? '#007bff' : '#ccc' }}>2. Gear</span>
        <span style={{ color: currentStep === 3 ? '#007bff' : '#ccc' }}>3. Checkout</span>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
        
        {currentStep === 1 && (
          <div>
            <h3>Select Date & Room</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>Select Date:</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Studio Room:</label>
              <select value={studioRoom} onChange={(e) => setStudioRoom(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
                <option value="Vocal Booth">Vocal Booth ({roomPrices['Vocal Booth']} RON)</option>
                <option value="Mixing Room A">Mixing Room A ({roomPrices['Mixing Room A']} RON)</option>
                <option value="Live Recording Room">Live Recording Room ({roomPrices['Live Recording Room']} RON)</option>
              </select>
            </div>
            <button 
              onClick={() => {
                if (!date) { alert('Te rog să selectezi o dată!'); return; }
                nextStep();
              }} 
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
            >
              Next
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3>Select Additional Gear</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              {availableGear.length === 0 ? <p>Nu există echipamente în baza de date.</p> : null}
              {availableGear.map(gear => (
                <label key={gear.id || gear.name} style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedGear.includes(gear.name)} 
                    onChange={() => handleGearToggle(gear.name)} 
                    style={{ transform: 'scale(1.2)' }}
                  />
                  {gear.imageUrl && (
                    <img src={gear.imageUrl} alt={gear.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                  )}
                  <span>{gear.name} ({gear.price || 50} RON)</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>Review & Checkout</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3>Order Summary</h3>
            <ul style={{ borderBottom: '1px solid #ccc', paddingBottom: '15px', marginBottom: '15px' }}>
              <li><strong>Date:</strong> {date}</li>
              <li><strong>Room:</strong> {studioRoom} ({roomPrices[studioRoom]} RON)</li>
              <li><strong>Gear:</strong> {selectedGear.length > 0 ? selectedGear.join(', ') : 'None'}</li>
            </ul>
            <h2 style={{ color: '#28a745' }}>Total: {totalPrice} RON</h2>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleCheckout} style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Confirm & Pay</button>
              <button onClick={prevStep} style={{ padding: '12px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>Edit Cart</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;