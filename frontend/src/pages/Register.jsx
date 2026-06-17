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
    try {
      await axios.post('http://localhost:3000/api/auth/register', { name, email, password });
      const loginResponse = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', loginResponse.data.token);
      setSuccess('Succes! Redirecționăm...');
      setTimeout(() => navigate('/'), 1500);
    } catch { setError('Înregistrarea a eșuat.'); }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-600 mb-8">
          Creare cont nou
        </h2>
        
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-center mb-4">{success}</p>}
        
        <div className="flex justify-center mb-6">
          <GoogleLogin onSuccess={ { /* logică Google */ }} />
        </div>

        <div className="text-center text-gray-400 my-4 uppercase text-xs tracking-widest">sau metoda clasică</div>

        <form onSubmit={handleStandardRegister} className="flex flex-col gap-4">
          <input type="text" placeholder="Nume complet" className="bg-black/30 border border-white/20 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" className="bg-black/30 border border-white/20 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Parolă" className="bg-black/30 border border-white/20 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-pink-600 p-3 rounded-lg font-bold hover:scale-[1.02] transition-transform">Sign Up</button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Ai deja cont? <Link to="/login" className="text-purple-400 hover:underline">Loghează-te aici.</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;