import React, { useState } from "react";
import { auth, provider } from "../../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import "./Auth.css";
import { Button } from "@mui/material";
import SignOutDialog from "../SignOutDialog"; // ✅ Import reusable component

function AuthComponent() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <button className="btn btn-primary" onClick={handleGoogleSignIn}>
        <img
          src="https://ssl.gstatic.com/images/branding/product/1x/gsa_512dp.png"
          alt="Google Logo"
          width="20"
          height="20"
          style={{ marginRight: "10px" }} 
        />
        Sign in with Google
      </button>

      {/* Sign-Out Button (Opens Confirmation Dialog) */}
      <Button className="btn btn-danger" onClick={() => setOpenDialog(true)}>
        Sign Out
      </Button>

      {/* 🔹 Reusable Sign-Out Dialog */}
      <SignOutDialog open={openDialog} onClose={() => setOpenDialog(false)} />

    </div>
  );
}

export default AuthComponent;
