import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheatAwn, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import "./Header1.css";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import { Menu, MenuItem, Dialog, DialogTitle, DialogContent } from "@mui/material";
import AccountInfo from "../AccountDetails/AccountInfo";
import SignOutDialog from "../SignOutDialog";

function Header1() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const tokenIntervalRef = useRef(null);
  const lastLogTimeRef = useRef(0);

  const TOKEN_EXPIRY_SECONDS = 900;
  const LOG_INTERVAL = 15000; // Log once every 15 seconds

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser && localStorage.getItem("Authorization")) {
        startTokenCountdown();
        setupActivityListeners();
      } else {
        clearTokenCountdown();
        removeActivityListeners();
      }
    });

    return () => {
      unsubscribe();
      clearTokenCountdown();
      removeActivityListeners();
    };
  }, []);

  const setupActivityListeners = () => {
    ["mousemove", "keydown", "scroll", "click"].forEach((event) =>
      window.addEventListener(event, resetTokenExpiry)
    );
  };

  const removeActivityListeners = () => {
    ["mousemove", "keydown", "scroll", "click"].forEach((event) =>
      window.removeEventListener(event, resetTokenExpiry)
    );
  };

  const resetTokenExpiry = () => {
    const token = localStorage.getItem("Authorization");
    if (!token) return;

    const newExpiryTime = Date.now() + TOKEN_EXPIRY_SECONDS * 1000;
    localStorage.setItem("TokenExpiry", newExpiryTime.toString());
  };

  const startTokenCountdown = () => {
    clearTokenCountdown();

    tokenIntervalRef.current = setInterval(() => {
      const expiryTime = parseInt(localStorage.getItem("TokenExpiry"), 10);
      const currentTime = Date.now();
      const timeLeftSec = Math.max(0, Math.floor((expiryTime - currentTime) / 1000));

      const now = Date.now();
      if (now - lastLogTimeRef.current >= LOG_INTERVAL || timeLeftSec <= 10) {
        lastLogTimeRef.current = now;
        console.log(`⏳ Token expires in ${timeLeftSec}s`);
      }

      if (timeLeftSec <= 0) {
        localStorage.removeItem("Authorization");
        localStorage.removeItem("TokenExpiry");
        clearTokenCountdown();
        console.warn("🔐 Token expired. Signing out...");
        signOut(auth).then(() => navigate("/"));
      }
    }, 1000);
  };

  const clearTokenCountdown = () => {
    if (tokenIntervalRef.current) {
      clearInterval(tokenIntervalRef.current);
      tokenIntervalRef.current = null;
    }
  };

  const storeToken = (token) => {
    const expiryTime = Date.now() + TOKEN_EXPIRY_SECONDS * 1000;
    localStorage.setItem("Authorization", token);
    localStorage.setItem("TokenExpiry", expiryTime.toString());
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.idToken;

      if (token) {
        storeToken(token);
        startTokenCountdown();
        setupActivityListeners();
      } else {
        console.error("No token received.");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("Authorization");
      localStorage.removeItem("TokenExpiry");
      clearTokenCountdown();
      removeActivityListeners();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleOpenAccountDialog = () => {
    setOpenAccountDialog(true);
    handleMenuClose();
  };
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

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/getstarted" onClick={() => setMenuOpen(false)}>Get Started</Link></li>
          <li><Link to="/history" onClick={() => setMenuOpen(false)}>View History</Link></li>
          <li><Link to="/features" onClick={() => setMenuOpen(false)}>Features</Link></li>
          <li><Link to="/soil" onClick={() => setMenuOpen(false)}>Soil Data</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
        </ul>

        {user ? (
          <div className="user-info" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div onClick={handleMenuOpen} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <Avatar alt="User" src={user?.photoURL || "https://via.placeholder.com/30"} sx={{ width: 30, height: 30 }} />
              <span>{user.displayName}</span>
            </div>
            <FontAwesomeIcon icon={faCaretDown} className="menu-icon" onClick={handleMenuOpen} style={{ cursor: "pointer" }} />
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

      <Dialog open={openAccountDialog} onClose={() => setOpenAccountDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Account Information</DialogTitle>
        <DialogContent>
          <AccountInfo />
        </DialogContent>
      </Dialog>

      <SignOutDialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} onConfirm={handleSignOut} />
    </div>
  );
}

export default Header1;
