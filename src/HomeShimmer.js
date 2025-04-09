import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import "./HomeShimmer.css"; 
                    // Optional: for additional styling

export default function HomeShimmer() {
  return (
    <div className="shimmer-container">
      <Stack direction="row" spacing={2} alignItems="center" className="shimmer-header">
        {/* Logo */}
        <Skeleton variant="circular" width={40} height={40} />

        {/* Project Title */}
        <Skeleton variant="text" width={180} height={35} />

        {/* Navigation Links */}
        <Stack direction="row" spacing={2} className="shimmer-nav">
          <Skeleton variant="text" width={80} height={35} />
          <Skeleton variant="text" width={100} height={35} />
          <Skeleton variant="text" width={120} height={35} />
          <Skeleton variant="text" width={90} height={35} />
          <Skeleton variant="text" width={110} height={35} />
        </Stack>

        {/* Authentication Buttons */}
        <Stack direction="row" spacing={2} className="shimmer-auth">
          <Skeleton variant="rectangular" width={90} height={35} />
          <Skeleton variant="rectangular" width={90} height={35} />
        </Stack>
      </Stack>

      <div className="shimmer-content">
        <Skeleton variant="rectangular" width="100%" height={400} />
      </div>
      
    </div>
  );
}
