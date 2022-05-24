import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import React,  { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AuthPage from './pages/Auth/authPage.component';
import EstimationDetails from './pages/estimationDetails/estimationDetails.component';
import HomePage from './pages/home/homePage.component';
import Signup from './pages/Signup/signup.component';
import context, { Provider } from './context/app-context';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth, firebaseDatabase } from './backend/firebaseHandler';
import { child, get, ref } from 'firebase/database';
import { SearchProvider } from './context/search-context';
import Pending from './pages/Pending/pending.component';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ff8f4c',
      main: '#FE5C1C',
      dark: '#c32500',
      contrastText: '#fff',
    },
  },
});

function App() {

  const [currentState, setCurrentState] = useState("SPLASH")
  const [userData, setUserData] = useContext(context)

  useEffect(() => {
    // firebaseAuth.signOut()
    onAuthStateChanged(firebaseAuth, (user)=>{
      if (user) {
        get(child(ref(firebaseDatabase), "USER_ARCHIVE/"+user.uid)).then((snap)=>{
          if (snap.exists()) {
            if (snap.child("status").val() === "NEW") {
              setCurrentState("PENDING")
            } else if (snap.child("status").val() === "ACTIVE") {
              setUserData(snap.val())
              setCurrentState("HOME")
            } else {
              alert("Your account is disabled by the Admin. If you think this may have been a mistake, please contact the Admin.")
              firebaseAuth.signOut()
            }
          } else {
            setCurrentState("LOGIN")
          }
        })
      } else {
        setCurrentState("LOGIN")
      }
    })
  }, [])

  if (currentState === "SPLASH") {
    return(
      <div></div>
    )
  }

  if (currentState === "LOGIN") {
    return(
      <AuthPage setCurrentState={setCurrentState} />
    )
  }

  if (currentState === "SIGNUP") {
    return(
      <Signup setCurrentState={setCurrentState} />
    )
  }

  if (currentState === "PENDING") {
    return(
      <Pending setCurrentState={setCurrentState} />
    )
  }

  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/:estimationId' element={<EstimationDetails />} />          
        </Routes>
    </div>
  );
}

export default () => {
  return (
    <SearchProvider>
      <Provider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </SearchProvider>
  )
};