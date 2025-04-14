import React, { Component, createRef, } from "react";
import FileUploadPreview from "../getStarted/FileUploadPreview";
import "../getStarted/css/InputForm.css";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { BiCurrentLocation } from "react-icons/bi";
import Swal from 'sweetalert2';
import axios from 'axios';
import axiosClient from "../../utils/axiosInterceptor"
import { auth } from "../../firebase"; // adjust the path if needed

// const fetch = require("node-fetch");

// const [soilData, setSoilData] = useState();

class InputForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            area: "",
            measureScale: "Square meters",
            previousCrops: ["", "", ""],
            address: "",
            city: "",
            pincode: "",
            contactNum: "",
            markerPosition: { lat: 19.99675137006276, lng: 73.78974342339409 },
            errors: {},
            soilData: null,
        };
        this.mapRef = createRef();
    }

    cropOptions = [
        "Adzuki Bean",
        "Bajra (Pearl Millet)",
        "Banana",
        "Barley",
        "Bengal Gram (Chickpea)",
        "Black Gram (Urad)",
        "Castor",
        "Chickpea",
        "Chili Pepper",
        "Coconut",
        "Common Bean",
        "Coriander",
        "Corn (Maize)",
        "Cotton",
        "Cowpea (Lobia)",
        "Cumin",
        "Eggplant (Brinjal)",
        "Finger Millet (Ragi)",
        "Foxtail Millet (Kangni)",
        "Garlic",
        "Ginger",
        "Green Gram (Moong)",
        "Groundnut (Peanut)",
        "Guar (Cluster Bean)",
        "Indian Mustard (Sarson)",
        "Jowar (Sorghum)",
        "Jute",
        "Kidney Bean (Rajma)",
        "Lentil (Masoor)",
        "Little Millet (Kutki)",
        "Mango",
        "Moth Bean",
        "Mustard",
        "Niger Seed",
        "Okra (Bhindi)",
        "Onion",
        "Pigeon Pea (Arhar/Toor)",
        "Potato",
        "Rice",
        "Sesame (Gingelly/Til)",
        "Sorghum (Jowar)",
        "Soybean",
        "Sugarcane",
        "Sunflower",
        "Sweet Potato",
        "Tamarind",
        "Turmeric",
        "Wheat",
        "Yam",
        "Zucchini"
    ];
    
    componentDidMount() {
        if (this.map) return;
        this.map = L.map(this.mapRef.current).setView(
            [this.state.markerPosition.lat, this.state.markerPosition.lng],
            13
        );

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);

        delete L.Icon.Default.prototype._getIconUrl;

        const currentLocationIcon = `<img width="30" height="30" src="https://img.icons8.com/external-those-icons-lineal-color-those-icons/30/external-pin-maps-and-locations-those-icons-lineal-color-those-icons-3.png" alt="external-pin-maps-and-locations-those-icons-lineal-color-those-icons-3"/>`;

        const customIcon = L.divIcon({
            html: currentLocationIcon,
            className: "leaflet-custom-icon",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
        });

        // Add draggable marker at default location with custom icon
        this.marker = L.marker(
            [this.state.markerPosition.lat, this.state.markerPosition.lng],
            { draggable: true, icon: customIcon }
        ).addTo(this.map);

        // Update state and address on marker drag
        this.marker.on("dragend", () => {
            const { lat, lng } = this.marker.getLatLng();
            this.setState({ markerPosition: { lat, lng } });
            this.getAddressFromCoordinates(lat, lng);
        });

        // Update marker position on map click
        this.map.on("click", (event) => {
            const { lat, lng } = event.latlng;
            this.marker.setLatLng([lat, lng]);
            this.setState({ markerPosition: { lat, lng } });
            this.getAddressFromCoordinates(lat, lng);
        });
    }

    getAddressFromCoordinates = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await response.json();

            if (data && data.display_name) {
                const addressParts = data.address || {};
                const city =
                    addressParts.city ||
                    addressParts.town ||
                    addressParts.village ||
                    addressParts.state_district ||
                    addressParts.county ||
                    addressParts.region ||
                    addressParts.state ||
                    "Unknown";

                this.setState({
                    address: data.display_name,
                    city: city,
                    pincode: addressParts.postcode || "",
                });
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };


    // Get current location using Geolocation API
    useCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.marker.setLatLng([latitude, longitude]);
                    this.map.setView([latitude, longitude], 13);
                    this.setState({ markerPosition: { lat: latitude, lng: longitude } });
                    this.getAddressFromCoordinates(latitude, longitude);
                },
                () => {
                    alert("Error fetching current location.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    updateMarkerFromAddress = async (address) => {
        if (!address.trim()) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                this.marker.setLatLng([lat, lon]);
                this.map.setView([lat, lon], 13);
                this.setState({ markerPosition: { lat, lng: lon } });
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    // Code for Form Validations
    validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!this.state.username.trim()) {
            errors.username = "Name is required.";
            isValid = false;
        }

        if (!this.state.area.trim() || isNaN(this.state.area) || this.state.area <= 0) {
            errors.area = "Enter a valid area.";
            isValid = false;
        }

        if (this.state.soilType === "Select Soil") {
            errors.soilType = "Please select a soil type.";
            isValid = false;
        }

        const phonePattern = /^[1-9]\d{9}$/;
        if (!this.state.contactNum.trim() || !phonePattern.test(this.state.contactNum)) {
            errors.contactNum = "Enter a valid 10-digit contact number.";
            isValid = false;
        }

        if (!this.state.address.trim()) {
            errors.address = "Address is required.";
            isValid = false;
        }

        this.setState({ errors });
        return isValid;
    };


    handleInputChange = async (event) => {
        this.setState({ [event.target.name]: event.target.value });

        if (this.state.errors[event.target.name]) {
            let errors = { ...this.state.errors };
            delete errors[event.target.name];
            this.setState({ errors });
        }

        if (event.target.name === "address") {
            this.updateMarkerFromAddress(event.target.value);
        }
    };

    submitPopUp(event) {
        event.preventDefault();

        if (!this.validateForm()) {
            Swal.fire({
                title: "Validation Error",
                text: "Please fill all required fields correctly.",
                icon: "error",
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You want to submit data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Submit"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Submitted",
                    text: "Your data has been submitted successfully !!!",
                    icon: "success"
                }).then(() => {
                    this.handleSubmit(event)
                }
                );
            }
        });
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Form Data:", this.state);
      
        const formData = new FormData();
        const account = new FormData()

        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) {
        Swal.fire("Error", "User not signed in. Please login again.", "error");
        return;
        }
        const userEmail = currentUser.email;

        formData.append("username", this.state.username);
        account.append("username", this.state.username);

        formData.append("area", this.state.area);
        formData.append("measureScale", this.state.measureScale);

        formData.append("email", userEmail);  // ✅ Add email field
        account.append("email", userEmail);

        formData.append("previousCrops", JSON.stringify(this.state.previousCrops));
        
        formData.append("address", this.state.address);
        account.append("address", this.state.address);

        formData.append("city", this.state.city);
        account.append("city", this.state.city);

        formData.append("pincode", this.state.pincode);
        account.append("pincode", this.state.pincode);

        formData.append("contactNum", this.state.contactNum)
        account.append("contactNum", this.state.contactNum)

        let userLocation = JSON.stringify(this.state.markerPosition);
        formData.append("markerPosition", JSON.stringify(this.state.markerPosition));
      
        const fileInput = document.querySelector("input[type='file']");
        if (fileInput && fileInput.files.length > 0) {
          for (let i = 0; i < fileInput.files.length; i++) {
            formData.append("reports", fileInput.files[i]);
          }
        }

        try {
            const response = await axios.post("http://localhost:5000/api/account/create-account", account,{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              }
            });
        
            const result = await response.json();
        
            if (response.ok) {
              console.log("✅ Account created:", result.data);
            } else {
              console.error("❌ Error:", result.message);
            }
          } catch (error) {
            console.error("🚨 Network error:", error);
          }
      

        try {
          const response = await axios.post("https://backend-dev-deployed.vercel.app/api/submit-farm-data", formData, {
            headers: {
              "Content-Type": "multipart/form-data"              
            },
          });
      
          if (response.status === 200 || response.status === 201) {
            Swal.fire("Success", "Data saved successfully!", "success");

            let parsedUserLocation = JSON.parse(userLocation);
            let userLat = parsedUserLocation.lat;
            let userLng = parsedUserLocation.lng;

            // Step 2: Fetch soil data (with nearby location check)
            let soilData = await this.fetchSoilData(userLat, userLng);
            // if (!soilData) {
            //     Swal.fire("Error", "Failed to fetch soil data.", "error");
            //     return;
            // }

            setTimeout(() => {
            }, 10000);

            const soilDataResponse = {
                soil_ph: 0,
                soil_nitrogen: 0,
                soil_phosphorus: 0,
                soil_potassium: 0,
                soil_moisture: 0,
                soil_cec: 0,
            };
            // debugger
            soilData.data.properties.layers.forEach(layer => {
                if (layer.depths?.length > 0) {
                  const meanValue = layer.depths[0].values.mean;
              
                  switch (layer.name) {
                    case "phh2o":
                        soilDataResponse.soil_ph = meanValue;
                      break;
                    case "nitrogen":
                        soilDataResponse.soil_nitrogen = meanValue;
                      break;
                    case "soc":
                        soilDataResponse.soil_phosphorus = meanValue;
                      break;
                    case "wv0010":
                        soilDataResponse.soil_moisture = meanValue;
                      break;
                    case "cec":
                        soilDataResponse.soil_cec = meanValue;
                      break;
                    case "potassium_extractable": 
                    soilDataResponse.soil_potassium = meanValue; 
                      break;
                  }
                }
              });
              

            // Step 3: Fetch weather data
            const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLng}&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&forecast_days=16`;
            const weatherResponse = await axios.get(weatherApi);
            const weatherData = weatherResponse.data.daily;
            const humidityData = weatherResponse.data.hourly.relative_humidity_2m;

            console.table(weatherData)
            console.table(humidityData)

            // Step 3: Merge Data
            const mergedData = {
                latitude: userLat,
                longitude: userLng,
                soil_ph: soilDataResponse.soil_ph || 0,
                soil_nitrogen: soilDataResponse.soil_nitrogen || 0,
                soil_phosphorus: soilDataResponse.soil_phosphorus || 0,
                soil_potassium: soilDataResponse.soil_potassium || 0,
                soil_moisture: soilDataResponse.soil_moisture || 0,
                soil_cec: soilDataResponse.soil_cec || 0,
                avg_temperature: weatherData.temperature_2m_max.reduce((a, b) => a + b, 0) / weatherData.temperature_2m_max.length,
                min_temperature: Math.min(...weatherData.temperature_2m_min),
                avg_humidity: humidityData.reduce((a, b) => a + b, 0) / humidityData.length,
                min_humidity: Math.min(...humidityData),
                avg_wind_speed: weatherData.wind_speed_10m_max.reduce((a, b) => a + b, 0) / weatherData.wind_speed_10m_max.length,
                total_rainfall: weatherData.precipitation_sum.reduce((a, b) => a + b, 0),
                historical_crops: this.state.previousCrops,
            };

            console.log("Merged Data:", mergedData);

            const storeResponse = await axios.post("https://dangerous-sabina-precision-farming-23844e94.koyeb.app/recommend", {
                data: mergedData
            });

            if (storeResponse.status === 200 || storeResponse.status === 201) {
                console.log("Merged Data Stored Successfully:", storeResponse.data);
            } else {
                console.error("Failed to store merged data:", storeResponse.data);
            }

        }else {
            Swal.fire("Error", response.data.error || "Failed to save data", "error");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          Swal.fire("Error", "Server error. Try again later.", "error");
        }


        // SUJAL Soil Data API Call
        try {
            const { lat, lng } = this.state.markerPosition;
              
              const currentUser = auth.currentUser;
              if (!currentUser) {
              console.warn("⚠️ No authenticated user found!");
              return;
              }
        
            const requestPromise = axiosClient.post("https://final-year-precision-farming-deployed.vercel.app/api/soil/save-soil-data", {
              userEmail: currentUser.email,
              latitude: lat,
              longitude: lng,
            });
        
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("⏱ Request timed out after 20 seconds")), 20000)
            );
        
            const response = await Promise.race([requestPromise, timeoutPromise]);
        
            const savedData = response.data.data;
            console.log("✅ Soil data stored & returned:", savedData);
        
            this.setState({ soilData: savedData.soilData });
            if (this.props.onSoilDataUpdate) {
              this.props.onSoilDataUpdate(savedData.soilData);
            }
          } catch (error) {
            console.error("❌ Failed to fetch/store soil data:", error.message);
          }

      

     };
      

      
      fetchSoilData = async (lat, lng) => {
        let maxAttempts = 5;
        let offset = 0.01;
        
        for (let i = 0; i < maxAttempts; i++) {
            try {
                console.log(`Attempt ${i + 1}: Fetching soil data at lat=${lat}, lng=${lng}`);
                const soilApi = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lng}&lat=${lat}&properties=phh2o,nitrogen,soc,cec,wv0010,potassium_extractable&depth=0-5cm`;
                const soilResponse = await axios.get(soilApi);
                
                console.log("Soil API Response:", soilResponse.data); // Log full response
                
                if (soilResponse.status === 200 && soilResponse.data && soilResponse.data.properties) {
                    console.log("✅ Soil Data Found:", soilResponse.data.properties);
                    return soilResponse;
                } else if (soilResponse.status === 200 && soilResponse.data.properties.layers[0].depths[0].values.mean === null) {
                    console.warn("⚠️ Data Not available for these coordinates...");
                }
            } catch (error) {
                console.error("❌ Error Fetching Soil Data:", error);
                if (error.response && error.response.status === 500) {
                    console.warn(`⚠️ Attempt ${i + 1}: Soil API failed. Retrying with nearby location...`);
                } else {
                    return null;
                }
            }
            
            // Adjust lat and lng for next attempt
            lat += (i % 2 === 0 ? offset : -offset);
            lng += (i % 2 === 0 ? offset : -offset);
            offset += 0.01; // Increase offset to expand search radius
            console.log("... Trying for lat:" + lat + " & lng:" + lng);
        }
        
        console.error("❌ Soil data could not be fetched after multiple attempts.");
        return null;
    };


    handleReturn = () => {
        window.location.href = "/";
    };

    render() {
        return (
            <div className="getStarted">
            <div className="input-form-container">
                <button type="button" className="return-button" onClick={this.handleReturn}>
                    ⮜ Home
                </button>
                <form onSubmit={(event) => this.submitPopUp(event)} method="POST">
                    <h1>Farm Details</h1>

                    <label>Name<span className="required-fields">*</span>:</label>
                    <input type="text" name="username" value={this.state.username} onChange={this.handleInputChange} placeholder="Name..." />
                    {this.state.errors.username && <small className="error">{this.state.errors.username}</small>}

                    <label>Farm Area<span className="required-fields">*</span>:</label>
                    <div id="area-input">
                        <input className="form-group" type="number" name="area" value={this.state.area} onChange={this.handleInputChange} placeholder="Area..." />
                        <select className="form-group" id="measure-scale" name="measureScale" value={this.state.measureScale} onChange={this.handleInputChange}>
                            <option value="Square meters">Square meters</option>
                            <option value="Hectare">Hectare</option>
                            <option value="Acre">Acre</option>
                            <option value="Bigha">Bigha</option>
                        </select>
                    </div>
                    {this.state.errors.area && <small className="error">{this.state.errors.area}</small>}

                    <label>Previous Crops<span className="required-fields">*</span> :</label>
                    <div id="previous-crops-input" style={{ display: "flex", gap: "10px", width: "100%" }}>
                        {this.state.previousCrops.map((crop, index) => (
                            <div key={index}>
                                <select
                                    value={crop}
                                    onChange={(event) => {
                                        let updatedCrops = [...this.state.previousCrops];
                                        updatedCrops[index] = event.target.value;
                                        this.setState({ previousCrops: updatedCrops });
                                    }}
                                    style={{
                                        width: "14.2rem",
                                        maxHeight: "150px",         // height for 5 items approx.
                                        overflowY: "auto",          // add vertical scroll
                                        position: "relative",       // allow positioning
                                        zIndex: 1                   // ensure it's above if overlapping
                                    }}
                                >
                                    <option value="">Select Crop</option>
                                    {this.cropOptions.map((cropOption, i) => (
                                        <option key={i} value={cropOption}>
                                            {cropOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

               
                    <label>Contact Number<span className="required-fields">*</span>:</label>
                    <input type="text" name="contactNum" value={this.state.contactNum} onChange={this.handleInputChange} placeholder="Enter contact number" />
                    {this.state.errors.contactNum && <small className="error">{this.state.errors.contactNum}</small>}

                    <label>Select Farm Location<span className="required-fields">*</span>:</label>
                    <input type="text" name="address" value={this.state.address} onChange={this.handleInputChange} placeholder="Enter address" />
                    {this.state.errors.address && <small className="error">{this.state.errors.address}</small>}

                    <div id="area-input">
                        <input
                            className="form-group"
                            type="text"
                            name="city"
                            value={this.state.city}
                            onChange={this.handleInputChange}
                            placeholder="Enter city"
                        />
                        <input
                            className="form-group"
                            type="text"
                            name="pincode"
                            value={this.state.pincode}
                            onChange={this.handleInputChange}
                            placeholder="Enter pin code"
                        />
                        <button
                            type="button"
                            className="use-current-location-btn"
                            onClick={this.useCurrentLocation}
                            title="Current Location"
                        >
                            <BiCurrentLocation size={24} />
                        </button>
                    </div>

                    <div ref={this.mapRef} style={{ width: "100%", height: "400px", marginBottom: "20px" }}></div>

                    <label>Reports (if any):</label>
                    <FileUploadPreview />

                    <button type="submit">Submit</button>
                </form>
            </div>
        
            {/* {this.state.soilData && <SoilInfo soilData={this.state.soilData} />} */}
            {/* {this.state.soilData ? <SoilInfo soilData={this.state.soilData} /> : <p>Loading soil data...</p>} */}

            </div>
        );
    }
}

export default InputForm;
