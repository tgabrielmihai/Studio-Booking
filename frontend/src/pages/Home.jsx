import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      
      {/* Logo-ul Centrat cu Chenar și Efecte */}
      <div className="relative group mb-10">
        {/* Efectul de "estompare"/glow din fundalul chenarului */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
        
        <img 
          src="/logo.jpg" 
          alt="Studio Logo" 
          className="relative w-64 h-64 rounded-full border-4 border-white/20 shadow-2xl transition-transform duration-500 hover:scale-105"
        />
      </div>

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 mb-6 leading-tight pb-2">
        Studio Booking Platform
      </h1>
      
      <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
        Reserve your creative space today. Access premium, high-fidelity analogue gear and top-tier acoustics tailored for your unique sound.
      </p>
      
      {/* Butoane Creative cu Hover */}
      <div className="flex gap-6">
        <Link 
          to="/bookings" 
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full font-bold shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-orange-500/50"
        >
          Book a Session
        </Link>
        <Link 
          to="/gear" 
          className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold transform transition-all duration-300 hover:scale-110 hover:bg-white/20"
        >
          Explore Gear Vault
        </Link>
      </div>
    </div>
  );
};

export default Home;