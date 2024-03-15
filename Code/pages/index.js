import React from 'react';
import Head from "next/head";
import { useUser } from '@auth0/nextjs-auth0/client';
import { Container, Navbar, NavbarBrand, Nav, NavItem, Button } from 'reactstrap';

export default function Home() {
  const { user } = useUser();

  const navbarStyle = {
    backgroundColor: '#D1C2D9', // Color for the navbar
    marginBottom: '20px', // Margin to separate from the content below
  };
  // Define inline styles
  const fullPageStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(to bottom, #E8DEED 50%, #D1C2D9 50%)', // 50/50 background color split
  };

  const headerTextStyle = {
    color: '#6C3483',
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0', // Remove margin
  };

  const subTextStyle = {
    color: '#6C3483',
    fontSize: '1rem',
    textAlign: 'center',
    marginTop: '0.5rem', // Small margin from the header
  };

  const loginButtonStyle = {
    backgroundColor: '#6C3483', // Dark purple color for the button
    borderColor: '#6C3483', // Same for the border
    color: '#fff',
    padding: '15px 30px', // Larger padding for a bigger button
    fontSize: '1rem',
    borderRadius: '20px', // Rounded corners for the button
    marginTop: '2rem', // Space from the text above
  };

  const footerTextStyle = {
    fontSize: '1.25rem',
    color: '#6C3483',
    position: 'absolute',
    bottom: '1rem', // Position at the bottom
    textAlign: 'center',
    width: '100%', // Full width
  };

  return (
    <>
      <Head>
        <title>Calendar App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={fullPageStyle}>
        <h1 style={headerTextStyle}>Welcome to Your Calendar</h1>
        {!user && (
          <>
            <p style={subTextStyle}>Please log in to create bookings.</p>
            <Button href="/api/auth/login" style={loginButtonStyle}>Log in</Button>
          </>
        )}
        {user && (
          <>
            <img
              src={user.picture}
              alt="Profile"
              className="nav-user-profile rounded-circle"
              width="50"
              height="50"
            />
            <p>Hello, {user.name}</p>
            <a href="/booking" className="btn btn-primary" id="go-to-booking-page">Go create a booking</a>
          </>
        )}
        <div style={footerTextStyle}>
          <NavbarBrand href="/">Calendar App</NavbarBrand>
        </div>
      </div>
    </>
  );
}
