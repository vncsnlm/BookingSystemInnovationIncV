import React from 'react';
import Image from 'next/image'; // Import the Image component

const navbarStyle = {
  backgroundColor: '#D1C2D9',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px'
};

const logoStyle = {
  // You might not need this anymore depending on your layout with the Image component
  maxHeight: '80px' // Adjust as needed
};

const navMenuStyle = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  gap: '20px' // Adjust spacing between items
};

const navItemStyle = {
  cursor: 'pointer',
  // Add more styling as needed
};

const bookNowButtonStyle = {
  backgroundColor: '#000', // Adjust the button color as needed
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
  // Add more styling as needed
};

const Navbar = () => {
  return (
    <nav style={navbarStyle}>
      <div>
        {/* Use the Image component here */}
        <Image src="/images/Kaan_Massage.jpg" alt="Ka'an Massage and Beauty" width={160} height={80} layout="intrinsic" />
      </div>
      <ul style={navMenuStyle}>
        <li style={navItemStyle}>HOME</li>
        <li style={navItemStyle}>ABOUT</li>
        <li style={navItemStyle}>RATES + SERVICES</li>
        <li style={navItemStyle}>GIFT CERTIFICATES</li>
        <li style={navItemStyle}>HOURS</li>
        <li style={navItemStyle}>CONTACT US</li>
      </ul>
      <button style={bookNowButtonStyle} id="go-to-booking-page-from-navbar">BOOK NOW</button>
    </nav>
  );
};

export default Navbar;
