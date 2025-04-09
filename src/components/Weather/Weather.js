// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Container, Card, CardContent, Typography, Grid, Button,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   Box, AppBar, Toolbar
// } from "@mui/material";
// import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Noon Sun
// import WbTwilightIcon from "@mui/icons-material/WbTwilight"; // Morning Sun
// import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness"; // Setting Sun
// import NightsStayIcon from "@mui/icons-material/NightsStay"; // Night Moon
// import CloudIcon from "@mui/icons-material/Cloud"; // Cloudy
// import ThunderstormIcon from "@mui/icons-material/Thunderstorm"; // Storm
// import AcUnitIcon from "@mui/icons-material/AcUnit"; // Snow
// import WaterDropIcon from "@mui/icons-material/WaterDrop"; // Humidity
// import AirIcon from "@mui/icons-material/Air"; // Wind

// const Weather = () => {
//   const [weather, setWeather] = useState(null);
//   const [showTable, setShowTable] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
//   const API_KEY = "f40391bc5c1d89ccee80ff33d2adc93c"; // Replace with your API Key

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(new Date().toLocaleTimeString());
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchLatLongAndWeather = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/get-farm-location");
//       const { latitude, longitude } = response.data;

//       const weatherResponse = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
//       );
//       setWeather(weatherResponse.data);
//       setShowTable(true);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setWeather(null);
//     }
//   };

//   // Function to select weather icon
//   const getWeatherIcon = (weatherMain) => {
//     switch (weatherMain) {
//       case "Clear":
//         return <WbSunnyIcon style={{ color: "orange", fontSize: 40 }} />;
//       case "Clouds":
//         return <CloudIcon style={{ color: "gray", fontSize: 40 }} />;
//       case "Thunderstorm":
//         return <ThunderstormIcon style={{ color: "purple", fontSize: 40 }} />;
//       case "Drizzle":
//       case "Rain":
//         return <WaterDropIcon style={{ color: "blue", fontSize: 40 }} />;
//       case "Snow":
//         return <AcUnitIcon style={{ color: "lightblue", fontSize: 40 }} />;
//       default:
//         return <WbSunnyIcon style={{ color: "yellow", fontSize: 40 }} />;
//     }
//   };

//   // Function to select sun/moon icon based on time of day
//   const getTimeIcon = () => {
//     const currentHour = new Date().getHours();
//     if (currentHour >= 5 && currentHour < 10) {
//       return <WbTwilightIcon style={{ color: "orange", fontSize: 30 }} />; // Morning
//     } else if (currentHour >= 10 && currentHour < 16) {
//       return <WbSunnyIcon style={{ color: "yellow", fontSize: 30 }} />; // Noon
//     } else if (currentHour >= 16 && currentHour < 19) {
//       return <SettingsBrightnessIcon style={{ color: "red", fontSize: 30 }} />; // Evening
//     } else {
//       return <NightsStayIcon style={{ color: "blue", fontSize: 30 }} />; // Night
//     }
//   };

//   return (
//     <>
//       {/* Top Navbar with Current Time */}
//       <AppBar position="static" sx={{ bgcolor: "#65a30d", boxShadow: 3 }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//             🌤 Precision Farming - Weather
//           </Typography>
//           <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             {getTimeIcon()} {currentTime}
//           </Typography>
//         </Toolbar>
//       </AppBar>


//       <Container maxWidth="sm" sx={{ mt: 4 }}>
//         <Grid container justifyContent="center">
//           <Button variant="contained" color="primary" onClick={fetchLatLongAndWeather} sx={{ mb: 3 }}>
//             Show Weather
//           </Button>
//         </Grid>

//         {/* Weather Display */}
//         {showTable && weather && (
//           <Card
//             sx={{
//               p: 4,
//               boxShadow: 10,
//               borderRadius: 3,
//               textAlign: "center",
//               backdropFilter: "blur(10px)",
//               background: `linear-gradient(135deg, ${weather.main.temp > 30 ? "#FF9800" : weather.main.temp > 20 ? "#2196F3" : "#3F51B5"
//                 }, #E3F2FD)`,
//               transition: "0.3s ease-in-out",
//               "&:hover": {
//                 transform: "scale(1.05)",
//                 boxShadow: 15,
//               },
//             }}
//           >
//             <CardContent>
//               {/* Location & Title */}
//               <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "white" }}>
//                 🌍 {weather.name}, {weather.sys.country}
//               </Typography>

//               {/* Weather Condition with Animated Icon */}
//               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 2 }}>
//                 <Box sx={{ transform: "scale(1.2)", transition: "0.3s", "&:hover": { transform: "scale(1.4)" } }}>
//                   {getWeatherIcon(weather.weather[0].main)}
//                 </Box>
//                 <Typography variant="h5" sx={{ color: "white", fontSize: 22 }}>
//                   {weather.weather[0].main}
//                 </Typography>
//               </Box>

//               {/* Weather Details Table */}
//               <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3, background: "rgba(255, 255, 255, 0.2)" }}>
//                 <Table>
//                   <TableHead sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }}>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Parameter</TableCell>
//                       <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Value</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell sx={{ color: "white" }}>🌡 Temperature</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>{weather.main.temp}°C</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell sx={{ color: "white" }}>💧 Humidity</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                         {weather.main.humidity}% <WaterDropIcon style={{ color: "blue" }} />
//                       </TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell sx={{ color: "white" }}>🌬 Wind Speed</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                         {weather.wind.speed} m/s <AirIcon style={{ color: "gray" }} />
//                       </TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell sx={{ color: "white" }}>☁️ Weather</TableCell>
//                       <TableCell sx={{ color: "white", fontWeight: "bold" }}>{weather.weather[0].main}</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>
//         )}

//       </Container>
//     </>
//   );
// };

// export default Weather;












import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container, Card, CardContent, Typography, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, AppBar, Toolbar
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
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const API_KEY = "f40391bc5c1d89ccee80ff33d2adc93c";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchLatLongAndWeather = async () => {
    try {
      const response = await axios.get("http://localhost:5005/get-farm-location");
      const { latitude, longitude } = response.data;

      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      setWeather(weatherResponse.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setWeather(null);
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
      <AppBar position="static" sx={{ bgcolor: "#65a30d", boxShadow: 3 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            🌤 Precision Farming - Weather
          </Typography>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getTimeIcon()} {currentTime}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Button variant="contained" color="primary" onClick={fetchLatLongAndWeather} sx={{ mb: 3 }}>
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
              background: `linear-gradient(135deg, ${weather.main.temp > 30 ? "#FF9800" : weather.main.temp > 20 ? "#2196F3" : "#3F51B5"
                }, #E3F2FD)`,
              transition: "0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 15,
              },
            }}
          >
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "white" }}>
                <LocationOnIcon /> {weather.name}, {weather.sys.country}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 2 }}>
                <Box sx={{ transform: "scale(1.2)", transition: "0.3s", "&:hover": { transform: "scale(1.4)" } }}>
                  {getWeatherIcon(weather.weather[0].main)}
                </Box>
                <Typography variant="h5" sx={{ color: "white", fontSize: 22 }}>
                  {weather.weather[0].main}
                </Typography>
              </Box>

              <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3, background: "rgba(255, 255, 255, 0.2)", color: "#09090b" }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: "#09090b" }}><ThermostatIcon /> Temperature</TableCell>
                      <TableCell sx={{ color: "#09090b", fontWeight: "bold" }}>{weather.main.temp}°C</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#09090b" }}><WaterDropIcon /> Humidity</TableCell>
                      <TableCell sx={{ color: "#09090b", fontWeight: "bold" }}>{weather.main.humidity}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: "#09090b" }}><AirIcon /> Wind Speed</TableCell>
                      <TableCell sx={{ color: "#09090b", fontWeight: "bold" }}>{weather.wind.speed} m/s</TableCell>
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
