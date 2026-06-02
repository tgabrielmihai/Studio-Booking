import { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      
      // Salvăm token-ul real primit de la backend
      localStorage.setItem('token', response.data.token);
      
      // Forțăm refresh-ul paginii pentru ca Navbar-ul să se actualizeze
      window.location.href = '/';
    } catch (err) {
      setError('Autentificare eșuată. Verifică email-ul și parola.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/google', {
        token: credentialResponse.credential
      });
      
      // Salvăm token-ul primit prin Google
      localStorage.setItem('token', response.data.token);
      
      // Forțăm refresh-ul
      window.location.href = '/';
    } catch (err) {
      setError('Eroare la conectarea cu serverul de backend.');
    }
  };

  return (
    <div>
      <h2>Autentificare Artist / Admin</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ marginBottom: '20px' }}>
        <GoogleLogin 
          onSuccess={handleGoogleSuccess} 
          onError={() => setError('Conexiunea la Google a eșuat.')} 
        />
      </div>

      <p>Sau folosește metoda clasică:</p>

      <form onSubmit={handleStandardLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Parolă:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Log in clasic</button>
      </form>
    </div>
  );
};

export default Login;