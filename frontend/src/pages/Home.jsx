import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h1 style={{ fontSize: '3em', marginBottom: '20px', color: '#333' }}>Studio Booking Platform</h1>
      <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
        Reserve your creative space today. Access premium, high-fidelity analogue gear and top-tier acoustics tailored for your unique sound.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link 
          to="/bookings" 
          style={{ padding: '15px 30px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          Book a Session
        </Link>
        <Link 
          to="/gear" 
          style={{ padding: '15px 30px', backgroundColor: '#212529', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          Explore Gear Vault
        </Link>
      </div>
    </div>
  );
};

export default Home;