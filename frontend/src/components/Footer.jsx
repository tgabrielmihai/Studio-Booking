const Footer = () => {
  return (
    <footer className="mt-auto py-8 text-center text-white border-t border-white/10 bg-black/30 backdrop-blur-md">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Studio Booking Platform. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;