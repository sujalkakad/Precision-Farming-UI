import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography"; // For headings
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper"; // To contain the farm data list
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import { auth } from "../../firebase"; // Adjust path if needed

const theme = createTheme({
  // Your theme definition (keep as is)
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInput-root": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
            borderRadius: "0px",
            backgroundColor: "transparent",
          },
          "& .MuiInput-root:before": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
          },
          "& .MuiInput-root:hover:before": {
            borderBottom: "2px solid black",
          },
          "& .MuiInput-root:after": {
            borderBottom: "2px solid #1976d2",
          },
          "& .MuiInput-root:focus, & .MuiInput-root:active": {
            outline: "none",
            boxShadow: "none",
            backgroundColor: "transparent",
          },
          "& .MuiInputLabel-root": {
            color: "rgba(0, 0, 0, 0.6)",
          },
        },
      },
    },
  },
});

function AccountInfo() {
  const [accountData, setAccountData] = useState({ // Renamed from formData for clarity
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [farmData, setFarmData] = useState([]); // State to hold farm data (array)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
  
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }
  
      const userEmail = currentUser.email;
      const authToken = localStorage.getItem("Authorization");
  
      try {
        const accountResponse = await axios.get("http://localhost:5000/api/account/get-account", {
          params: { email: userEmail },
          headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: "Bearer " + authToken }),
          },
        });
  
        const { username, email, contactNum, address, city, pincode } = accountResponse.data;
  
        setAccountData({
          name: username || currentUser.displayName || "",
          email: email || userEmail || "",
          phone: contactNum || "",
          address: address || "",
          city: city || "",
          pincode: pincode || "",
        });
  
      } catch (err) {
        console.error("❌ Account fetch failed:", err?.response?.data || err.message);
        setError(err?.response?.data?.message || "Failed to fetch account data.");
  
        // Fallback data
        setAccountData(prev => ({
          ...prev,
          name: prev.name || currentUser.displayName || "",
          email: prev.email || userEmail || "",
        }));
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllData();
  }, []);
  

  // --- Handlers ---
  const handleAccountSubmit = (e) => {
    e.preventDefault();
    console.log("Account data to submit:", accountData);
    // Implement your update logic here (API call to update account info)
    alert("Update functionality not implemented yet.");
  };

  const displayCityPincode = () => {
    if (accountData.city && accountData.pincode) {
      return `${accountData.city} - ${accountData.pincode}`;
    } else if (accountData.city) {
        return accountData.city;
    } else if (accountData.pincode) {
        return accountData.pincode;
    }
    return "";
  };

  const handleCityPincodeChange = (e) => {
    const value = e.target.value;
    const parts = value.split('-').map(part => part.trim());

    if (parts.length >= 2) {
      setAccountData({
        ...accountData,
        city: parts[0],
        pincode: parts[1]
      });
    } else {
      // Basic split assuming city might contain hyphens, pincode doesn't
       const lastHyphenIndex = value.lastIndexOf('-');
       if (lastHyphenIndex > 0 && value.substring(lastHyphenIndex + 1).trim().match(/^\d+$/)) {
            setAccountData({
                ...accountData,
                city: value.substring(0, lastHyphenIndex).trim(),
                pincode: value.substring(lastHyphenIndex + 1).trim()
            });
       } else {
           setAccountData({
                ...accountData,
                city: value, // Assume it's just city if no clear separator
                pincode: ""
           });
       }
    }
  };

  // --- Render Logic ---
  if (loading) return <div style={{ padding: '20px' }}>Loading account and farm information...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>

            {/* --- Account Information Form --- */}
            <Typography variant="h5" gutterBottom>Account Information</Typography>
            <Paper elevation={2} sx={{ padding: 3, marginBottom: 4 }}>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "calc(100% - 16px)" }, // Adjust width accounting for margin
                    display: "flex",
                    flexDirection: "column",
                    gap: 1, // Reduced gap slightly
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleAccountSubmit}
                >
                <TextField
                  required
                  label="Name"
                  type="text"
                  variant="standard"
                  value={accountData.name}
                  onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                  fullWidth
                />

                <TextField
                  label="Email"
                  type="email"
                  variant="standard"
                  value={accountData.email}
                  fullWidth
                  disabled // Email usually shouldn't be changed here
                  InputLabelProps={{ shrink: true }} // Ensure label doesn't overlap value
                />

                <TextField
                  label="Mobile No."
                  type="tel"
                  variant="standard"
                  value={accountData.phone}
                  onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: !!accountData.phone }} // Shrink if value exists
                />

                {/* Password field might be better handled in a separate "Change Password" section */}
                {/* <TextField
                  label="Password"
                  type="password"
                  autoComplete="new-password" // Use new-password to avoid autofill issues sometimes
                  variant="standard"
                  fullWidth
                /> */}

                <TextField
                  label="Address"
                  type="text"
                  variant="standard"
                  value={accountData.address}
                  onChange={(e) => setAccountData({ ...accountData, address: e.target.value })}
                  fullWidth
                   InputLabelProps={{ shrink: !!accountData.address }}
                />

                <TextField
                  label="City - Pincode"
                  type="text"
                  variant="standard"
                  value={displayCityPincode()}
                  onChange={handleCityPincodeChange}
                  fullWidth
                   InputLabelProps={{ shrink: !!(accountData.city || accountData.pincode) }}
                />

                <button type="submit" style={{ marginTop: 20, padding: '10px 20px', cursor: 'pointer' }}>
                  Save Account Changes
                </button>
              </Box>
           </Paper>

           {/* --- Farm Data Display Section --- */}
           <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>My Farm Data</Typography>
           <Paper elevation={2} sx={{ padding: 3 }}>
               {farmData.length > 0 ? (
                 <List disablePadding>
                   {farmData.map((farm, index) => {
                       // Safely parse JSON strings, provide defaults if parsing fails
                       let previousCropsList = [];
                       try {
                           previousCropsList = JSON.parse(farm.previousCrops || '[]');
                       } catch (e) { console.error("Failed to parse previousCrops:", farm.previousCrops); }

                       let markerPos = { lat: 'N/A', lng: 'N/A' };
                       try {
                            if (farm.markerPosition) markerPos = JSON.parse(farm.markerPosition);
                       } catch (e) { console.error("Failed to parse markerPosition:", farm.markerPosition); }


                       return (
                         <React.Fragment key={farm._id || index}> {/* Use _id if available from MongoDB */}
                           <ListItem alignItems="flex-start">
                             <ListItemText
                               primary={`Farm Entry ${index + 1} (${farm.area ? `${farm.area} ${farm.measureScale || ''}` : 'Area not specified'})`}
                               secondary={
                                 <>
                                   <Typography component="span" variant="body2" color="text.primary">
                                     Address:
                                   </Typography>
                                   {` ${farm.address || 'N/A'}, ${farm.city || 'N/A'} - ${farm.pincode || 'N/A'}`}
                                   <br />
                                   <Typography component="span" variant="body2" color="text.primary">
                                     Location (Lat/Lng):
                                   </Typography>
                                   {` ${markerPos.lat}, ${markerPos.lng}`}
                                   <br />
                                   <Typography component="span" variant="body2" color="text.primary">
                                     Previous Crops:
                                   </Typography>
                                   {` ${Array.isArray(previousCropsList) ? previousCropsList.join(', ') : 'N/A'}`}
                                   {/* Add other fields as needed */}
                                 </>
                               }
                             />
                           </ListItem>
                           {index < farmData.length - 1 && <Divider variant="inset" component="li" />}
                         </React.Fragment>
                       );
                    })}
                 </List>
               ) : (
                 <Typography>No farm data submitted yet.</Typography>
               )}
           </Paper>
        </Box>
    </ThemeProvider>
  );
}

export default AccountInfo;