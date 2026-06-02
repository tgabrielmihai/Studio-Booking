import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gearItems, setGearItems] = useState([]);

  // Stări pentru formulare
  const [newReviewRoom, setNewReviewRoom] = useState('Vocal Booth');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  const [newGearName, setNewGearName] = useState('');
  const [newGearPrice, setNewGearPrice] = useState('');
  const [newGearImageUrl, setNewGearImageUrl] = useState('');

  const fetchData = async () => {
    try {
      const [bookRes, revRes, gearRes] = await Promise.all([
        axios.get('http://localhost:3000/api/bookings'),
        axios.get('http://localhost:3000/api/bookings/reviews'),
        axios.get('http://localhost:3000/api/gear') // Lista publică de echipamente
      ]);
      setBookings(bookRes.data);
      setReviews(revRes.data);
      setGearItems(gearRes.data);
    } catch (error) { console.error('Eroare la preluarea datelor:', error); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- ACȚIUNI REZERVĂRI ---
  const markAsCompleted = async (id) => {
    await axios.put(`http://localhost:3000/api/admin/bookings/${id}/complete`);
    fetchData();
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Ștergi definitiv această rezervare?')) {
      await axios.delete(`http://localhost:3000/api/admin/bookings/${id}`);
      fetchData();
    }
  };

  // --- ACȚIUNI REVIEW-URI ---
  const handleAddReview = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/api/admin/reviews', {
      room: newReviewRoom, rating: newReviewRating, text: newReviewText
    });
    setNewReviewText('');
    fetchData();
  };

  const deleteReview = async (id) => {
    if (window.confirm('Ștergi acest review?')) {
      await axios.delete(`http://localhost:3000/api/admin/reviews/${id}`);
      fetchData();
    }
  };

  // --- ACȚIUNI ECHIPAMENTE (GEAR) ---
  const handleAddGear = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/api/admin/gear', {
      name: newGearName, price: newGearPrice, imageUrl: newGearImageUrl
    });
    setNewGearName('');
    setNewGearPrice('');
    setNewGearImageUrl('');
    fetchData();
  };

  const deleteGear = async (id) => {
    if (window.confirm('Ștergi acest echipament din inventar?')) {
      await axios.delete(`http://localhost:3000/api/admin/gear/${id}`);
      fetchData();
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>🛠️ Admin Dashboard</h1>

      {/* 1. REZERVĂRI */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ borderBottom: '2px solid red', paddingBottom: '10px' }}>Management Rezervări</h2>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Data</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Camera</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{b.id}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{b.date}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{b.room}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  <strong style={{ color: b.status === 'UPCOMING' ? 'orange' : 'green' }}>{b.status}</strong>
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  {b.status === 'UPCOMING' && (
                    <button onClick={() => markAsCompleted(b.id)} style={{ background: 'green', color: 'white', border: 'none', padding: '6px 12px', marginRight: '10px', borderRadius: '4px', cursor: 'pointer' }}>Mark Completed</button>
                  )}
                  <button onClick={() => deleteBooking(b.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 2. REVIEW-URI */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ borderBottom: '2px solid blue', paddingBottom: '10px' }}>Management Review-uri</h2>
        
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
          <h3>Adaugă Review manual</h3>
          <form onSubmit={handleAddReview} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <select value={newReviewRoom} onChange={(e) => setNewReviewRoom(e.target.value)} style={{ padding: '8px' }}>
              <option value="Vocal Booth">Vocal Booth</option>
              <option value="Mixing Room A">Mixing Room A</option>
              <option value="Live Recording Room">Live Recording Room</option>
            </select>
            <input type="number" min="1" max="5" value={newReviewRating} onChange={(e) => setNewReviewRating(e.target.value)} style={{ padding: '8px', width: '60px' }} />
            <input type="text" value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} required style={{ padding: '8px', flexGrow: 1 }} placeholder="Text recenzie..." />
            <button type="submit" style={{ background: 'blue', color: 'white', border: 'none', padding: '9px 20px', borderRadius: '4px', cursor: 'pointer' }}>Postează</button>
          </form>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {reviews.map(r => (
            <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span><strong style={{ color: '#ffc107' }}>{'★'.repeat(r.rating)}</strong> <strong>{r.room}</strong>: "{r.text}"</span>
              <button onClick={() => deleteReview(r.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. ECHIPAMENTE (GEAR) */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ borderBottom: '2px solid purple', paddingBottom: '10px' }}>Management Inventar Echipamente (GearVault)</h2>
        
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
          <h3>Adaugă Echipament Nou</h3>
          <form onSubmit={handleAddGear} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <input type="text" value={newGearName} onChange={(e) => setNewGearName(e.target.value)} required style={{ padding: '8px', flexGrow: 1 }} placeholder="Nume echipament (ex. Shure SM7B)" />
            <input type="number" value={newGearPrice} onChange={(e) => setNewGearPrice(e.target.value)} required style={{ padding: '8px', width: '100px' }} placeholder="Preț (RON)" />
            <input type="text" value={newGearImageUrl} onChange={(e) => setNewGearImageUrl(e.target.value)} style={{ padding: '8px', flexGrow: 1 }} placeholder="Link imagine (URL) - opțional" />
            <button type="submit" style={{ background: 'purple', color: 'white', border: 'none', padding: '9px 20px', borderRadius: '4px', cursor: 'pointer' }}>Adaugă</button>
          </form>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {gearItems.map(g => (
            <li key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {g.imageUrl && <img src={g.imageUrl} alt={g.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                <strong>{g.name}</strong> - {g.price} RON
              </div>
              <button onClick={() => deleteGear(g.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
          {gearItems.length === 0 && <p style={{ color: '#666' }}>Inventarul este gol.</p>}
        </ul>
      </section>

    </div>
  );
};

export default AdminPanel;