import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleStandardRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Crearea contului clasic
      await axios.post('http://localhost:3000/api/auth/register', {
        name,
        email,
        password
      });

      // Autentificare automată după creare
      const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', loginResponse.data.token);
      setSuccess('Cont creat cu succes! Te redirecționăm automat...');
      
      setTimeout(() => {
        navigate('/'); 
      }, 1500);

    } catch (err) {
      setError('Înregistrarea a eșuat. Poate email-ul este deja folosit?');
    }
  };

  // Funcția pentru conectarea/înregistrarea cu Google
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/google', {
        token: credentialResponse.credential
      });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Eroare la conectarea cu serverul de backend.');
    }
  };

  return (
    <div>
      <h2>Creare Cont Nou (Artist)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <div style={{ marginBottom: '20px' }}>
        <GoogleLogin 
          onSuccess={handleGoogleSuccess} 
          onError={() => setError('Conexiunea la Google a eșuat.')} 
        />
      </div>

      <p>Sau folosește metoda clasică:</p>

      <form onSubmit={handleStandardRegister}>
        <div>
          <label>Nume complet:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Parolă:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Ai deja cont? <Link to="/login">Loghează-te aici</Link>.
      </p>
    </div>
  );
};

export default Register;