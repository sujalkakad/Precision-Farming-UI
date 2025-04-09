import React, { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // ✅ Separate CSS for Signup

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
  
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/"); // ✅ Redirect to home on success
    } catch (error) {
      let errorMessage = "Failed to create an account. Please try again.";
  
      if (error.code === "auth/email-already-in-use") {
        errorMessage = (
          <>
            This email is already registered. Try{" "}
            <a href="/auth">logging in</a> instead.
          </>
        );
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      }
  
      setError(errorMessage);
      console.error("Sign-Up Error:", error);
    }
  };
  
  

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>} {/* ✅ Show error if any */}
      <form onSubmit={handleSignUp} className="signup-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
      <p className="login-link">
        Already have an account? <a href="/auth">Log in</a>
      </p>
    </div>
  );
}

export default Signup;
