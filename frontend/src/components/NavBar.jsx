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
        } catch {
            console.error('Token-ul este invalid sau corupt.');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    // Clasa pentru efectul de hover la link-uri
    const linkStyle = "text-white font-medium hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-purple-500 transition-all duration-300 hover:scale-105";

    return (
        <nav className="flex items-center justify-between px-10 py-6 bg-black/30 backdrop-blur-md border-b border-white/10 shadow-lg mb-8">
            {/* Logo Text cu Gradient */}
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 tracking-wider">
                STUDIO BOOKING PLATFORM
            </div>
            
            <ul className="flex gap-8 list-none m-0 p-0 items-center">
                <li><Link to="/" className={linkStyle}>Home</Link></li>

                {isLoggedIn ? (
                    <>
                        <li><Link to="/my-sessions" className={linkStyle}>My Sessions</Link></li>
                        <li><Link to="/bookings" className={linkStyle}>Bookings</Link></li>
                        {isAdmin && (
                            <li><Link to="/admin" className="text-orange-400 font-bold hover:scale-105 transition-transform">Admin Panel</Link></li>
                        )}
                        <li><Link to="/gear" className={linkStyle}>Gear Vault</Link></li>
                        <li><Link to="/showcase" className={linkStyle}>Showcase</Link></li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-full font-medium hover:scale-110 transition-transform shadow-lg"
                            >
                                Log Out
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/register" className={linkStyle}>Sign Up</Link></li>
                        <li><Link to="/login" className={linkStyle}>Log In</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;