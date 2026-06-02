import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    let isAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            isAdmin = decoded.role === 'ADMIN';
        } catch (error) {
            console.error('Token-ul este invalid sau corupt.');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <nav style={{ padding: '15px 20px', backgroundColor: '#1a1a1a', color: 'white', marginBottom: '30px' }}>
            <ul style={{ display: 'flex', gap: '20px', listStyleType: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
                <li><Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link></li>

                {isLoggedIn ? (
                    <>
                        <li><Link to="/my-sessions" style={{ color: 'white', textDecoration: 'none' }}>My Sessions</Link></li>
                        <li><Link to="/bookings" style={{ color: 'white', textDecoration: 'none' }}>Bookings</Link></li>

                        {isAdmin && (
                            <li><Link to="/admin" style={{ color: '#ffb347', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link></li>
                        )}

                        <li><Link to="/gear" style={{ color: 'white', textDecoration: 'none' }}>Gear Vault</Link></li>
                        <li><Link to="/showcase" style={{ color: 'white', textDecoration: 'none' }}>Showcase</Link></li>

                        <li style={{ marginLeft: 'auto' }}>
                            <button
                                onClick={handleLogout}
                                style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                Log Out
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li style={{ marginLeft: 'auto' }}><Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link></li>
                        <li><Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Log In</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;