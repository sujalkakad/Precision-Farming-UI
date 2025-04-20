
import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Stack,
  Fade,
} from "@mui/material";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isFieldError = (field) => touched[field] && !formData[field];

  const sendEmail = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Swal.fire({ title: "You are not signed in!", icon: "warning" });
      return;
    }

    try {
      const token = await user.getIdToken(true);
      await axios.post(
        "https://final-year-precision-farming-deployed.vercel.app/api/contact/addContact",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({ title: "Message Sent!", icon: "success" });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTouched({ name: false, email: false, phone: false, message: false });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ title: "Failed to send message.", icon: "error" });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // or "100%" if you want it to strictly fit visible space
        backgroundImage:
          'url("https://static.vecteezy.com/system/resources/previews/013/402/878/large_2x/beautiful-wooden-floor-and-green-rice-field-nature-background-agriculture-product-standing-showcase-background-free-photo.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 0, // reduce vertical padding
        mt: -4,
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={6}
          sx={{
            p: 3,
            pb:1,
            maxWidth: 500,
            width: "100%",
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            mb={3}
            fontWeight="bold"
            color="primary.main"
          >
            Contact Us
          </Typography>

          <form onSubmit={sendEmail} noValidate>
            <Stack spacing={0.5}>
              <TextField
                error={isFieldError("name")}
                label="Name"
                name="name"
                multiline
                variant="standard"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  isFieldError("name") ? "Please enter your name." : " "
                }
              />

              <TextField
                error={isFieldError("email")}
                label="Email"
                name="email"
                multiline
                variant="standard"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  isFieldError("email") ? "Please enter your email." : " "
                }
              />

              <TextField
                error={isFieldError("phone")}
                label="Phone"
                name="phone"
                multiline
                variant="standard"
                fullWidth
                required
                inputProps={{ maxLength: 10, pattern: "[0-9]{10}" }}
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  isFieldError("phone")
                    ? "Please enter a valid phone number."
                    : " "
                }
              />

              <TextField
                error={isFieldError("message")}
                label="Message"
                name="message"
                multiline
                rows={3}
                variant="standard"
                fullWidth
                required
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  isFieldError("message")
                    ? "Message field is mandatory."
                    : " "
                }
              />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      py: 1.2,
                      px: 3,
                      fontWeight: "normal",
                      fontSize: "0.1rem",
                      borderRadius: 2,
                      whiteSpace: "nowrap",
                      minWidth: "40%",
                    }}
                  >
                    Send Message
                  </Button>
                </Box>


            </Stack>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}

export default Contact;
