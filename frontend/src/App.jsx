import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login'; 
import Register from './pages/Register';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import AdminPanel from './pages/AdminPanel';
import GearVault from './pages/GearVault';
import StudioShowcase from './pages/Showcase';
import MySessions from './pages/MySessions';


function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '0 20px' }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/my-sessions" element={<MySessions />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/gear" element={<GearVault />} />
          <Route path="/showcase" element={<StudioShowcase />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;