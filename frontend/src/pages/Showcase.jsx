import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Showcase = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  // Preluăm toate review-urile din Postgres prin ruta cuplată în backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/bookings/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Eroare la preluarea recenziilor din baza de date:', error);
      }
    };
    fetchReviews();
  }, []);

  const handleGoToReviews = () => {
    // Trimite utilizatorul la pagina de sesiuni unde își poate alege o ședință încheiată
    navigate('/my-sessions');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to the Studio Showcase</h1>
      <p>Discover our premium recording spaces and see what other artists say about us.</p>
      
      {/* Zona de acțiune care trimite utilizatorul către My Sessions */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3>Want to leave a review?</h3>
        <p style={{ color: '#555' }}>Click the button below to view your completed studio sessions and share your feedback.</p>
        
        <button 
          onClick={handleGoToReviews} 
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1em'
          }}
        >
          Select a Session to Review
        </button>
      </div>

      {/* Afișarea dinamică a recenziilor preluate din PostgreSQL */}
      <div style={{ marginTop: '50px', borderTop: '2px solid #eee', paddingTop: '30px' }}>
        <h2>Community Reviews</h2>
        
        {reviews.length === 0 ? (
          <p style={{ color: '#666' }}>No reviews yet. Book a session, complete it, and be the first to share your experience!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {reviews.map((review) => (
              <div key={review.id} style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
                <div style={{ color: '#ffc107', fontSize: '1.2em', marginBottom: '10px' }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p style={{ fontStyle: 'italic', color: '#444', marginBottom: '15px' }}>"{review.text}"</p>
                <div style={{ fontSize: '0.8em', color: '#888' }}>
                  <strong>Room:</strong> {review.room} <br />
                  <strong>Date:</strong> {review.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Showcase;