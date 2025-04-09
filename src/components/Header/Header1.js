import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheatAwn, faCaretDown  } from "@fortawesome/free-solid-svg-icons";
import "./Header1.css";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import { Menu, MenuItem, Dialog, DialogTitle, DialogContent } from "@mui/material";
import AccountInfo from "../AccountDetails/AccountInfo";
import SignOutDialog from "../SignOutDialog";

import InputForm from '../getStarted/InputForm';
import SoilInfo from '../soilDisplay/soilInfoDisplay';

function Header1() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Mobile menu state

  const [soilData, setSoilData] = useState(null);

  // Callback function to receive soilData from InputForm
  const handleSoilData = (data) => {
    console.log("📡 Updating soilData in Header1:", data);
    setSoilData(data);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (!credential) {
        console.error("No credential returned from Google Sign-In");
        return;
      }

      const token = credential?.accessToken; // Extract JWT token

      if (!token) {
        console.error("No access token received.");
        return;
      }

      localStorage.setItem("Authorization", token);
      // localStorage.setItem("Authorization", token);

      console.log("JWT Token Stored Successfully");

    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("Authorization");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Open user dropdown
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close user dropdown
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Open Account Dialog
  const handleOpenAccountDialog = () => {
    setOpenAccountDialog(true);
    handleMenuClose();
  };

  // Open Logout Dialog
  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
    handleMenuClose();
  };

  return (
    <div className="Header">
      <nav>
        <div className="logo-container">
          <Link to="/">
            <FontAwesomeIcon icon={faWheatAwn} className="logoicon" />
          </Link>
          <h2>Precision Farming</h2>
        </div>

        {/* ✅ Navbar Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/getstarted" onClick={() => setMenuOpen(false)}>Get Started</Link></li>
          <li><Link to="/history" onClick={() => setMenuOpen(false)}>View History</Link></li>
          <li><Link to="/features" onClick={() => setMenuOpen(false)}>Features</Link></li>
          <li><Link to="/soil" onClick={() => setMenuOpen(false)}>Soil Data</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
        </ul>

        {/* ✅ Authentication Section */}
        {user ? (
          <div className="user-info" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* ✅ Avatar + Username */}
            <div 
              className="user-avatar" 
              onClick={handleMenuOpen} 
              style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Avatar 
                alt="User" 
                src={user?.photoURL || "https://via.placeholder.com/30"} 
                sx={{ width: 30, height: 30 }} 
              />
              <span>{user.displayName}</span>
            </div>

            {/* ✅ Menu Icon for Dropdown */}
            <FontAwesomeIcon 
              icon={faCaretDown}
              className="menu-icon" 
              onClick={handleMenuOpen} 
              style={{ cursor: "pointer" }} 
            />

            {/* ✅ User Dropdown Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleOpenAccountDialog}>Account</MenuItem>
              <MenuItem onClick={handleOpenLogoutDialog}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn btn-primary" onClick={handleGoogleSignIn}>Sign In</button>
            <button className="btn btn-secondary" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        )}
      </nav>

      {/* ✅ Account Info Dialog */}
      <Dialog open={openAccountDialog} onClose={() => setOpenAccountDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Account Information</DialogTitle>
        <DialogContent>
          <AccountInfo />
        </DialogContent>
      </Dialog>

      {/* ✅ Logout Confirmation Dialog */}
      <SignOutDialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} onConfirm={handleSignOut} />
    </div>
  );
}

export default Header1;
