import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ThermostatIcon from "@mui/icons-material/Thermostat";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // const fetchLatLongAndWeather = async () => {
  //   try {
  //     navigator.geolocation.getCurrentPosition(async (position) => {
  //       const latitude = position.coords.latitude;
  //       const longitude = position.coords.longitude;

  //       const weatherResponse = await axios.get(
  //         `https://backend-dev-deployed.vercel.app/api/forecast?lat=${latitude}&lon=${longitude}`
  //       );

  //       const data = weatherResponse.data;

  //       setWeather({
  //         name: data.city,
  //         sys: { country: data.country },
  //         main: {
  //           temp: data.forecasts[0].temperature,
  //           humidity: data.forecasts[0].humidity,
  //         },
  //         weather: [{
  //           main: data.forecasts[0].weather,
  //           description: data.forecasts[0].description,
  //         }],
  //         wind: { speed: data.forecasts[0].windSpeed }
  //       });

  //       setShowTable(true);
  //     }, (error) => {
  //       console.error("Error getting location:", error);
  //       alert("Location access is required to show weather.");
  //     });
  //   } catch (error) {
  //     console.error("Error fetching weather:", error);
  //     setWeather(null);
  //     alert("Failed to fetch weather.");
  //   }
  // };

  const fetchLatLongAndWeather = async () => {
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const API_KEY = "6ceabbca9d90802732987e8ea40412cd";
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

          const weatherResponse = await axios.get(forecastUrl);
          const data = weatherResponse.data;

          const city = data.city.name;
          const country = data.city.country;
          const forecast = data.list[0]; // Current time forecast

          setWeather({
            name: city,
            sys: { country: country },
            main: {
              temp: forecast.main.temp,
              humidity: forecast.main.humidity,
            },
            weather: [
              {
                main: forecast.weather[0].main,
                description: forecast.weather[0].description,
              },
            ],
            wind: { speed: forecast.wind.speed },
          });

          setShowTable(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location access is required to show weather.");
        }
      );
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather(null);
      alert("Failed to fetch weather.");
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case "Clear":
        return <WbSunnyIcon style={{ color: "orange", fontSize: 45 }} />;
      case "Clouds":
        return <CloudIcon style={{ color: "gray", fontSize: 45 }} />;
      case "Thunderstorm":
        return <ThunderstormIcon style={{ color: "purple", fontSize: 45 }} />;
      case "Drizzle":
      case "Rain":
        return <WaterDropIcon style={{ color: "blue", fontSize: 45 }} />;
      case "Snow":
        return <AcUnitIcon style={{ color: "lightblue", fontSize: 45 }} />;
      default:
        return <WbSunnyIcon style={{ color: "yellow", fontSize: 45 }} />;
    }
  };

  const getTimeIcon = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 10) {
      return <WbTwilightIcon style={{ color: "orange", fontSize: 35 }} />;
    } else if (currentHour >= 10 && currentHour < 16) {
      return <WbSunnyIcon style={{ color: "yellow", fontSize: 35 }} />;
    } else if (currentHour >= 16 && currentHour < 19) {
      return <SettingsBrightnessIcon style={{ color: "red", fontSize: 35 }} />;
    } else {
      return <NightsStayIcon style={{ color: "blue", fontSize: 35 }} />;
    }
  };

  return (
    <>
      {/* <AppBar position="static" sx={{ bgcolor: "#65a30d", boxShadow: 3 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            🌤 Precision Farming - Weather
          </Typography>
          
        </Toolbar>
      </AppBar> */}

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={fetchLatLongAndWeather}
            sx={{ mb: 3 }}
          >
            Show Weather
          </Button>
        </Grid>

        {showTable && weather && (
          <Card
            sx={{
              p: 4,
              boxShadow: 10,
              borderRadius: 3,
              textAlign: "center",
              backdropFilter: "blur(10px)",
              background: `linear-gradient(135deg, ${
                weather.main.temp > 30
                  ? "#FF9800"
                  : weather.main.temp > 20
                  ? "#2196F3"
                  : "#3F51B5"
              }, #E3F2FD)`,
              transition: "0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 15,
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  display: "flex", // Keep using flex for icon + text layout
                  alignItems: "center", // Keep vertical alignment
                  justifyContent: "center", // Center the flex items horizontally
                  gap: 1, // Keep gap between icon and text
                  width: "100%", // Ensure it takes full width for centering
                  mb: 1, // Optional: Add some margin below the time
                }}
              >
                {getTimeIcon()} {currentTime}
              </Typography>

              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "white" }}
              >
                <LocationOnIcon /> {weather.name}, {weather.sys.country}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    transform: "scale(1.2)",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.4)" },
                  }}
                >
                  {getWeatherIcon(weather.weather[0].main)}
                </Box>
                <Typography variant="h5" sx={{ color: "white", fontSize: 22 }}>
                  {weather.weather[0].main}
                </Typography>
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  mt: 3,
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#09090b",
                }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: "#09090b" }}>
                        <ThermostatIcon /> Temperature
                      </TableCell>
                      <TableCell sx={{ color: "#09090b", fontWeight: "bold" }}>
                        {weather.main.temp}°C
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#09090b" }}>
                        <WaterDropIcon /> Humidity
                      </TableCell>
                      <TableCell sx={{ color: "#09090b", fontWeight: "bold" }}>
                        {weather.main.humidity}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#09090b" }}>
                        <AirIcon /> Wind Speed
                      </TableCell>
                      <TableCell sx={{ color: "#09090b", fontWeight: "bold" }}>
                        {weather.wind.speed} m/s
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Weather;
