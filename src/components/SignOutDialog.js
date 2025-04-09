// src/components/SignOutDialog.js
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { auth } from "../firebase";

function SignOutDialog({ open, onClose }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("Authorization"); // Remove JWT Token
      setSnackbarOpen(true); // Show success message
      onClose(); // Close dialog
  
      setTimeout(() => {
        navigate("/"); // Redirect after small delay
      }, 500);
  
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };
  

  return (
    <>
      {/* Sign Out Confirmation Dialog */}
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to sign out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={handleSignOut} color="error">Sign Out</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Signed out successfully!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}

export default SignOutDialog;
