
import React from "react";

function Dashboard({ user }) {
  return (
    <div className="container">
      <h2>Welcome to the Dashboard, {user.displayName}!</h2>
      <img src={user.photoURL} alt="User Profile" width="100" />
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Dashboard;
