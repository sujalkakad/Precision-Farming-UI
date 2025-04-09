import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { CssBaseline } from "@mui/material";
import { auth, provider } from "./firebase"; // ✅ Firebase imports
import Header1 from "./components/Header/Header1"; // ✅ Header Component
import Slide from "./components/Slide/Slide";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Testimonial from "./components/Testimonial/Testimonial";
import Dashboard from "./components/Footer/Dashboard"; // ✅ Dashboard Component
import AuthComponent from "./components/AuthComponent/AuthComponent"; // ✅ Separate Auth Component
import Signup from "./components/Signup/Signup"; // ✅ Signup Component
import HomeShimmer from "./HomeShimmer";
import InputForm from "./components/getStarted/InputForm";
import SoilInfo from "./components/soilDisplay/soilInfoDisplay";
import { SoilProvider } from "./context/soilContext";
import axiosClient from "./utils/axiosInterceptor"
// import { CssBaseline } from '@mui/material';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // ✅ Listen for authentication state changes
  //   const unsubscribe = auth.onAuthStateChanged((currentUser) => {
  //     setUser(currentUser);
  //   });

  //   return () => unsubscribe(); // ✅ Cleanup function
  // }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // ✅ Set the authenticated user
      setLoading(false); // ✅ Set loading to false when auth state resolves
    });

    return () => unsubscribe(); // ✅ Cleanup function
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  if (loading) {
    return <HomeShimmer />; // ✅ Show shimmer for the whole app
  }

  return (
    <Router>
      <CssBaseline /> {/* ✅ Global MUI baseline reset */}
      <div className="App">

        {/* <CssBaseline/> */}
        <SoilProvider>
          <Header1 /> {/* ✅ Keep header consistent on all pages */}
        
        <div className="MainContent">
          <Routes>
            {/* ✅ Home Route */}
            <Route
              path="/"
              element={
                <>
                  <Slide />
                  <HowItWorks />
                  <About />
                  <Testimonial />
                </>
              }
            />

            <Route path="/getStarted" element={<InputForm />} />

            {/* ✅ Signup Page */}
            <Route path="/signup" element={<Signup />} />

            <Route path="/soil" element={<SoilInfo />} />

            {/* ✅ Contact Page */}
            <Route path="/contact" element={<Contact />} />

            {/* ✅ Authentication Page */}
            <Route path="/auth" element={<AuthComponent />} />

            {/* ✅ Dashboard Route - Only for logged-in users */}
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard user={user} /> // ✅ Show Dashboard if logged in
                ) : (
                  <div className="auth-container">
                    <p>Please sign in to access the dashboard.</p>
                    <button
                      className="btn btn-primary"
                      onClick={handleGoogleSignIn}
                    >
                      Sign in with Google
                    </button>
                  </div>
                )
              }
            />
          </Routes>
        </div>
        <Footer />
        </SoilProvider>
      </div>
    </Router>
  );
}

export default App;
