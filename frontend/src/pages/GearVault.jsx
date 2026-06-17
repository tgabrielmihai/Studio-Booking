import { useState, useEffect } from 'react';
import axios from 'axios';

const GearVault = () => {
  const [gearList, setGearList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGear = async () => {
      try {
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

  if (loading) return <div className="text-center text-white py-20 text-xl">Loading the Gear Vault...</div>;

  return (
    <div className="p-6 md:p-12 min-h-screen">
      {/* Titlu cu Gradient și Capslock */}
      <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 mb-6 uppercase tracking-widest">
        THE GEAR VAULT
      </h2>
      <p className="text-center text-gray-300 mb-12 max-w-xl mx-auto">
        Explore our curated collection of premium studio hardware and instruments.
      </p>

      {/* Grid Carduri Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gearList.map((gear) => (
          <div key={gear.id} className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col transition-transform hover:scale-105">
            
            {gear.imageUrl && (
              <img 
                src={gear.imageUrl} 
                alt={gear.name} 
                className="w-full h-56 object-cover rounded-2xl mb-5"
              />
            )}

            <h3 className="text-2xl font-bold text-white mb-1">{gear.name}</h3>
            <p className="text-orange-400 text-sm uppercase tracking-widest font-semibold mb-4">{gear.type}</p>
            <p className="text-gray-300 leading-relaxed mb-6 flex-grow">{gear.description}</p>
            
            {gear.technicalSpecs && (
              <div className="mt-auto bg-white/5 p-4 rounded-xl border border-white/5 text-sm">
                <strong className="text-white block mb-2">Technical Specs:</strong>
                <ul className="space-y-1 text-gray-400">
                  {Object.entries(gear.technicalSpecs).map(([key, value]) => (
                    <li key={key}>
                      <span className="text-gray-200">{key}:</span> {value}
                    </li>
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