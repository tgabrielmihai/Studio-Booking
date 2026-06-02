import { useState, useEffect } from 'react';
import axios from 'axios';

const GearVault = () => {
  const [gearList, setGearList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGear = async () => {
      try {
        // Link-ul tău real și funcțional de pe MockAPI
        const response = await axios.get('https://6a1de398bcc4f20d5ca53058.mockapi.io/gear');
        setGearList(response.data);
      } catch (err) {
        console.error('Error fetching gear from API:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGear();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>Loading the Gear Vault...</div>;

  return (
    <div>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>The Gear Vault</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Explore our curated collection of premium studio hardware and instruments.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {gearList.map((gear) => (
          <div key={gear.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fdfdfd', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Imaginea afișată curat, profesional, fără filtre sumbre */}
            {gear.imageUrl && (
              <img 
                src={gear.imageUrl} 
                alt={gear.name} 
                style={{ 
                  width: '100%', 
                  height: '220px', 
                  objectFit: 'cover', 
                  borderRadius: '6px', 
                  marginBottom: '15px'
                }} 
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.3em', color: '#111' }}>{gear.name}</h3>
            </div>
            
            <p style={{ fontSize: '0.9em', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 15px 0' }}>{gear.type}</p>
            <p style={{ lineHeight: '1.5', color: '#333', flexGrow: 1 }}>{gear.description}</p>
            
            {gear.technicalSpecs && (
              <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#f9f9f9', borderLeft: '3px solid #007bff', fontSize: '0.85em' }}>
                <strong style={{ display: 'block', marginBottom: '8px', color: '#111' }}>Technical Specs:</strong>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
                  {Object.entries(gear.technicalSpecs).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default GearVault;