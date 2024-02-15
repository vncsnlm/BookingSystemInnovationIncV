import React from 'react';
//import './HomePage.css'; 

function HomePage() {
  
  return (
    <div className="home-container" style={{ backgroundImage:"Code\Images\IMG_5620.jpg" }}>
      <nav className="navbar">
        <div className="navbar-left">
          <a href="/" className="nav-logo">
            <img src="Code\Images\Ka'an Massage.jpg" alt="Logo" />
          </a>
        </div>
        <div className="navbar-right">
          <a href="tel:1234567890">Call or Text Now</a>
          <button className="book-now">BOOK NOW</button>
        </div>
        <div className="navbar-links">
          <a href="#home">HOME</a>
          <a href="#about">ABOUT</a>
          <a href="#rates">RATES + SERVICES</a>
          <a href="#gift-certificates">GIFT CERTIFICATES</a>
          <a href="#hours">HOURS</a>
          <a href="#contact-us">CONTACT US</a>
        </div>
      </nav>
      <div className="main-content">
        <h1>every body needs balance</h1>
        <button className="book-now">BOOK NOW</button>
      </div>
    </div>
  );
}

export default HomePage;