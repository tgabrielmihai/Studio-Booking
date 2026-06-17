import { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/';
    } catch { setError('Eroare autentificare.'); }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-600 mb-8">
          Autentificare
        </h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        
        <div className="flex justify-center mb-6">
            <GoogleLogin onSuccess={ { /* logică Google */ }} />
        </div>

        <form onSubmit={handleStandardLogin} className="flex flex-col gap-4">
          <input type="text" placeholder="Email" className="bg-black/30 border border-white/20 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Parolă" className="bg-black/30 border border-white/20 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-pink-600 p-3 rounded-lg font-bold hover:scale-[1.02] transition-transform">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;