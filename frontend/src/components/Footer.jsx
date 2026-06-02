const Footer = () => {
  return (
    <footer style={{ marginTop: '50px', padding: '20px', textAlign: 'center', backgroundColor: '#f0f0f0', borderTop: '1px solid #ccc' }}>
      <p style={{ margin: 0, color: '#555' }}>
        &copy; {new Date().getFullYear()} Studio Booking Platform. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;