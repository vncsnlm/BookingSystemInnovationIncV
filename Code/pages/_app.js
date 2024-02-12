import { Provider } from "react-redux";
import { persistor, store } from "redux/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import "styles/globals.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "theme";
import { UserProvider } from '@auth0/nextjs-auth0/client';

//import "../pages/homepage/HomePages.css"

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <UserProvider>
      {/* <PersistGate persistor={persistor}> */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      {/* </PersistGate> */}
      </UserProvider>
    </Provider>
  );
}

export default MyApp;
