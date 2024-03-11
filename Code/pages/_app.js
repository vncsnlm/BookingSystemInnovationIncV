import React from 'react';
import { Provider } from "react-redux";
import { store } from "redux/configureStore";
// import { PersistGate } from "redux-persist/integration/react"; // Uncomment if you decide to use PersistGate
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "theme";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import NavBar from './Navbar'; // Make sure this path is correct
import 'styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';


//import "../pages/homepage/HomePages.css"

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <UserProvider>
        {/* If you want to use PersistGate, you can uncomment these lines
        <PersistGate loading={null} persistor={persistor}> */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar /> {/* NavBar component added here */}
            <Component {...pageProps} />
          </ThemeProvider>
        {/* </PersistGate> */}
      </UserProvider>
    </Provider>
  );
}

export default MyApp;
