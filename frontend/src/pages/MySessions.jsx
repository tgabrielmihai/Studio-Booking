import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [reviewingSession, setReviewingSession] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  
  const navigate = useNavigate();

  // 1. Preluăm sesiunile reale din baza de date Postgres la încărcarea paginii
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/bookings');
        setSessions(response.data);
      } catch (error) {
        console.error('Eroare la preluarea sesiunilor:', error);
      }
    };
    fetchBookings();
  }, []);

  const upcomingSessions = sessions.filter(s => s.status === 'UPCOMING');
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');

  // 2. Tritem review-ul în Postgres și redirecționăm utilizatorul
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/bookings/reviews', {
        sessionId: reviewingSession.id,
        room: reviewingSession.room,
        rating: Number(rating),
        text: reviewText,
        date: new Date().toLocaleDateString()
      });

      alert('Review-ul a fost salvat cu succes în Postgres!');
      
      // Resetăm starea formularului
      setReviewingSession(null);
      setReviewText('');
      setRating(5);
      
      // TRICK-UL LOGIC: Trimitem utilizatorul înapoi pe Showcase unde își va vedea review-ul proaspăt adăugat
      navigate('/showcase');
    } catch (error) {
      alert('Eroare la salvarea recenziei în baza de date.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>My Studio Sessions</h2>
      
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#007bff' }}>Upcoming Sessions</h3>
        {upcomingSessions.length === 0 ? (
          <p>No upcoming sessions.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {upcomingSessions.map(session => (
              <div key={session.id} style={{ padding: '15px', border: '1px solid #b8daff', borderRadius: '8px', backgroundColor: '#e2e3e5' }}>
                <strong>{session.date}</strong> - {session.room} 
                <span style={{ float: 'right', color: '#004085', fontWeight: 'bold' }}>{session.price} RON</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 style={{ color: '#28a745' }}>Completed Sessions</h3>
        {completedSessions.length === 0 ? (
          <p>No completed sessions yet. Finish a session to leave a review.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {completedSessions.map(session => (
              <div key={session.id} style={{ padding: '15px', border: '1px solid #c3e6cb', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{session.date}</strong> - {session.room}
                  </div>
                  <button 
                    onClick={() => setReviewingSession(session)}
                    style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Leave a Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modalul pentru scrierea review-ului */}
      {reviewingSession && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3 style={{ marginTop: 0 }}>Review Session from {reviewingSession.date}</h3>
            <p style={{ color: '#666' }}>Room: {reviewingSession.room}</p>
            
            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Rating (1-5 Stars):</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)} 
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Your Feedback:</label>
                <textarea 
                  rows="4" 
                  value={reviewText} 
                  onChange={(e) => setReviewText(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setReviewingSession(null)} style={{ padding: '10px', backgroundColor: '#ccc', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Post Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySessions;