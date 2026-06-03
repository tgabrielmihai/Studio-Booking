import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gearItems, setGearItems] = useState([]);

  const [newReviewRoom, setNewReviewRoom] = useState('Vocal Booth');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewDate, setNewReviewDate] = useState(new Date().toISOString().split('T')[0]);

  const [newGearName, setNewGearName] = useState('');
  const [newGearPrice, setNewGearPrice] = useState('');
  const [newGearImageUrl, setNewGearImageUrl] = useState('');
  const [newGearType, setNewGearType] = useState('Microphone');
  const [newGearDescription, setNewGearDescription] = useState('');

  const getLoggedUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.sub; 
    } catch (e) {
      return null;
    }
  };

  const fetchData = async () => {
    try {
      const [bookRes, revRes, gearRes] = await Promise.all([
        axios.get('http://localhost:3000/api/admin/bookings'),
        axios.get('http://localhost:3000/api/bookings/reviews'),
        axios.get('http://localhost:3000/api/gear')
      ]);
      setBookings(bookRes.data);
      setReviews(revRes.data);
      setGearItems(gearRes.data);
    } catch (error) { 
      console.error('Eroare la preluarea datelor:', error); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const markAsCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/admin/bookings/${id}/complete`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Ștergi definitiv această rezervare?')) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/bookings/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const currentUserId = getLoggedUserId();
      await axios.post('http://localhost:3000/api/admin/reviews', {
        room: newReviewRoom,
        rating: Number(newReviewRating),
        text: newReviewText,
        date: newReviewDate,
        userId: currentUserId
      });
      setNewReviewText('');
      setNewReviewRating(5);
      fetchData();
    } catch (error) { 
      console.error(error); 
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm('Ștergi acest review?')) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/reviews/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddGear = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/gear', {
        name: newGearName, 
        price: Number(newGearPrice), 
        imageUrl: newGearImageUrl, 
        type: newGearType, 
        description: newGearDescription
      });
      setNewGearName(''); 
      setNewGearPrice(''); 
      setNewGearImageUrl(''); 
      setNewGearDescription('');
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGear = async (id) => {
    if (window.confirm('Ștergi acest echipament?')) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/gear/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>🛠️ Admin Dashboard</h1>

      {/* 1. REZERVĂRI */}
      <section style={{ marginBottom: '50px' }}>
        <h2>Management Rezervări</h2>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Client (Artist)</th>
              <th style={{ padding: '10px' }}>Data</th>
              <th style={{ padding: '10px' }}>Camera</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{b.id}</td>
                <td style={{ padding: '10px' }}><strong>{b.user?.name || 'Utilizator Google/Anonim'}</strong> ({b.user?.email || 'N/A'})</td>
                <td style={{ padding: '10px' }}>{b.date}</td>
                <td style={{ padding: '10px' }}>{b.room}</td>
                <td style={{ padding: '10px' }}><span style={{ color: b.status === 'UPCOMING' ? 'orange' : 'green' }}>{b.status}</span></td>
                <td style={{ padding: '10px' }}>
                  {b.status === 'UPCOMING' && <button onClick={() => markAsCompleted(b.id)}>Complete</button>}
                  <button onClick={() => deleteBooking(b.id)} style={{ marginLeft: '10px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 2. REVIEW-URI */}
      <section style={{ marginBottom: '50px' }}>
        <h2>Management Review-uri</h2>
        <form onSubmit={handleAddReview} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select value={newReviewRoom} onChange={(e) => setNewReviewRoom(e.target.value)}>
            <option value="Vocal Booth">Vocal Booth</option>
            <option value="Mixing Room A">Mixing Room A</option>
            <option value="Live Recording Room">Live Recording Room</option>
          </select>
          <input type="date" value={newReviewDate} onChange={(e) => setNewReviewDate(e.target.value)} required />
          <div style={{ display: 'flex', gap: '5px', fontSize: '20px' }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} onClick={() => setNewReviewRating(s)} style={{ cursor: 'pointer', color: s <= newReviewRating ? '#ffc107' : '#ccc' }}>★</span>
            ))}
          </div>
          <input type="text" value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} required placeholder="Scrie recenzia..." />
          <button type="submit">Postează</button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {reviews.map(r => (
            <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span><strong style={{ color: '#ffc107' }}>{'★'.repeat(r.rating)}</strong> de la <strong>{r.user?.name || 'Anonim'}</strong> pentru <strong>{r.room}</strong> ({r.date}): "{r.text}"</span>
              <button onClick={() => deleteReview(r.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. ECHIPAMENTE */}
      <section style={{ marginBottom: '50px' }}>
        <h2>Management Inventar Echipamente (GearVault)</h2>
        <form onSubmit={handleAddGear} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" value={newGearName} onChange={(e) => setNewGearName(e.target.value)} required placeholder="Nume" />
          <select value={newGearType} onChange={(e) => setNewGearType(e.target.value)}>
            <option value="Microphone">Microphone</option>
            <option value="Instrument">Instrument</option>
            <option value="Synthesiser">Synthesiser</option>
          </select>
          <input type="number" value={newGearPrice} onChange={(e) => setNewGearPrice(e.target.value)} required placeholder="Preț" />
          <input type="text" value={newGearDescription} onChange={(e) => setNewGearDescription(e.target.value)} required placeholder="Descriere" />
          <input type="text" value={newGearImageUrl} onChange={(e) => setNewGearImageUrl(e.target.value)} placeholder="URL Imagine" />
          <button type="submit">Adaugă</button>
        </form>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
          {gearItems.map(g => (
            <li key={g.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <div><strong>{g.name}</strong> - {g.price} RON <br/><small>{g.type} | {g.description}</small></div>
              <button onClick={() => deleteGear(g.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;