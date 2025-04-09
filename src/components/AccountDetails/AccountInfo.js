import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInput-root": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.42)", // Standard style
            borderRadius: "0px", // No box or outline
            backgroundColor: "transparent", // Prevents box effect
          },
          "& .MuiInput-root:before": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.42)", // Default underline
          },
          "& .MuiInput-root:hover:before": {
            borderBottom: "2px solid black", // Thicker on hover
          },
          "& .MuiInput-root:after": {
            borderBottom: "2px solid #1976d2", // Blue underline when active
          },
          "& .MuiInput-root:focus, & .MuiInput-root:active": {
            outline: "none", // Remove outline box
            boxShadow: "none", // No shadow or box effect
            backgroundColor: "transparent", // Ensure no background on focus
          },
          "& .MuiInputLabel-root": {
            color: "rgba(0, 0, 0, 0.6)", // Default label color
          },
        },
      },
    },
  },
});

function AccountInfo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const token = localStorage.getItem("Authorization"); // Assuming auth token is stored here
        const response = await fetch("/api/contact", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.success) {
          setFormData(result.data);
        } else {
          console.error("Error:", result.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "100%" }, // Adjust width
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          label="Name"
          type="name"
          variant="standard"
          value="formData.name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          fullWidth
        />

        <TextField
          label="Email"
          type="email"
          variant="standard"
          fullWidth
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <TextField
          label="Mobile No."
          type="tel"
          variant="standard"
          fullWidth
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"
          fullWidth
        />

        <TextField
          label="Address Line 1"
          type="address"
          variant="standard"
          fullWidth
        />
        <TextField
          label="Address Line 2"
          type="address"
          variant="standard"
          fullWidth
        />
      </Box>
    </ThemeProvider>
  );
}

export default AccountInfo;
