// --- START OF MERGED FILE InputForm.js ---

import React, { useState, useEffect, useRef } from "react";
import FileUploadPreview from "../getStarted/FileUploadPreview"; // Assuming path is correct
import "../getStarted/css/InputForm.css"; // Assuming path is correct
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BiCurrentLocation } from "react-icons/bi";
import Swal from 'sweetalert2';
import axios from 'axios'; // Use standard axios for general calls
import axiosClient from "../../utils/axiosInterceptor"; // Use configured client for authenticated calls
import { auth } from "../../firebase"; // Import Firebase auth
import { useNavigate } from "react-router-dom";

// Configuration (Update these URLs as needed)
const FARM_DATA_API_URL = "https://backend-dev-deployed.vercel.app/api/submit-farm-data"; // Vercel backend for farm data
const ACCOUNT_API_URL = "https://final-year-precision-farming-deployed.vercel.app/api/account/create-account"; // Your backend for account creation/update
const SOIL_SAVE_API_URL = "https://final-year-precision-farming-deployed.vercel.app/api/soil/save-soil-data"; // Your backend for saving soil data
const RECOMMENDATION_API_URL = "https://squid-intense-nearly.ngrok-free.app/recommend"; // Recommendation service (Ngrok - update if deployed)

const InputForm = () => {
    const navigate = useNavigate();

    // --- State Variables ---
    const [username, setUsername] = useState("");
    const [area, setArea] = useState("");
    const [measureScale, setMeasureScale] = useState("Square meters");
    const [previousCrops, setPreviousCrops] = useState(["", "", ""]);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [contactNum, setContactNum] = useState("");
    const [markerPosition, setMarkerPosition] = useState({ lat: 19.99675137006276, lng: 73.78974342339409 });
    const [errors, setErrors] = useState({});
    const [soilData, setSoilData] = useState(null); // State to hold soil data if needed later

    // --- Refs ---
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);

    // --- Static Data ---
    const cropOptions = ["Adzuki Bean", "Bajra (Pearl Millet)", "Banana", "Barley", "Bengal Gram (Chickpea)", "Black Gram (Urad)", "Castor", "Chickpea", "Chili Pepper", "Coconut", "Common Bean", "Coriander", "Corn (Maize)", "Cotton", "Cowpea (Lobia)", "Cumin", "Eggplant (Brinjal)", "Finger Millet (Ragi)", "Foxtail Millet (Kangni)", "Garlic", "Ginger", "Green Gram (Moong)", "Groundnut (Peanut)", "Guar (Cluster Bean)", "Indian Mustard (Sarson)", "Jowar (Sorghum)", "Jute", "Kidney Bean (Rajma)", "Lentil (Masoor)", "Little Millet (Kutki)", "Mango", "Moth Bean", "Mustard", "Niger Seed", "Okra (Bhindi)", "Onion", "Pigeon Pea (Arhar/Toor)", "Potato", "Rice", "Sesame (Gingelly/Til)", "Sorghum (Jowar)", "Soybean", "Sugarcane", "Sunflower", "Sweet Potato", "Tamarind", "Turmeric", "Wheat", "Yam", "Zucchini"];

    // --- Effects ---
    // Initialize Map
    useEffect(() => {
        if (mapInstance.current || !mapRef.current) return;

        mapInstance.current = L.map(mapRef.current).setView(
            [markerPosition.lat, markerPosition.lng],
            13
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© OpenStreetMap contributors',
        }).addTo(mapInstance.current);

        // Fix for default icon path issue in some setups
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });


        const currentLocationIconHTML = `<img width="30" height="30" src="https://img.icons8.com/external-those-icons-lineal-color-those-icons/30/external-pin-maps-and-locations-those-icons-lineal-color-those-icons-3.png" alt="Location Pin"/>`;

        const customIcon = L.divIcon({
            html: currentLocationIconHTML,
            className: "leaflet-custom-icon", // Add custom styling if needed
            iconSize: [30, 30],
            iconAnchor: [15, 30], // Point of the icon which corresponds to marker's location
        });

        markerInstance.current = L.marker(
            [markerPosition.lat, markerPosition.lng],
            { draggable: true, icon: customIcon }
        ).addTo(mapInstance.current);

        markerInstance.current.on("dragend", () => {
            const { lat, lng } = markerInstance.current.getLatLng();
            setMarkerPosition({ lat, lng });
            getAddressFromCoordinates(lat, lng);
        });

        mapInstance.current.on("click", (event) => {
            const { lat, lng } = event.latlng;
            markerInstance.current.setLatLng([lat, lng]);
            setMarkerPosition({ lat, lng });
            getAddressFromCoordinates(lat, lng);
        });

        // Initial address fetch for default coordinates
        getAddressFromCoordinates(markerPosition.lat, markerPosition.lng);

        // Cleanup function
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                markerInstance.current = null; // Clear marker ref too
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    // --- Helper Functions ---
    const getAddressFromCoordinates = async (lat, lon) => {
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
                    ""; // Default to empty string if not found

                setAddress(data.display_name);
                setCity(city);
                setPincode(addressParts.postcode || "");
            } else {
                setAddress("Address not found");
                setCity("");
                setPincode("");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("Error fetching address");
            setCity("");
            setPincode("");
        }
    };

    const useCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (markerInstance.current && mapInstance.current) {
                        markerInstance.current.setLatLng([latitude, longitude]);
                        mapInstance.current.setView([latitude, longitude], 13);
                        setMarkerPosition({ lat: latitude, lng: longitude });
                        getAddressFromCoordinates(latitude, longitude);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    Swal.fire("Location Error", `Could not get current location: ${error.message}`, "error");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Options
            );
        } else {
            Swal.fire("Unsupported", "Geolocation is not supported by this browser.", "warning");
        }
    };

    const updateMarkerFromAddress = async (addr) => {
        if (!addr.trim()) return;

        try {
            // Debounce or throttle this in a real app if called frequently on typing
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1` // Limit to 1 result
            );
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);
                if (markerInstance.current && mapInstance.current) {
                    markerInstance.current.setLatLng([newLat, newLng]);
                    mapInstance.current.setView([newLat, newLng], 13);
                    setMarkerPosition({ lat: newLat, lng: newLng });
                    // Optionally re-fetch address to normalize it based on coords
                    // getAddressFromCoordinates(newLat, newLng);
                }
            } else {
                console.warn("No location found for the address:", addr);
                 // Optionally clear city/pincode or show a warning?
            }
        } catch (error) {
            console.error("Error fetching location from address:", error);
        }
    };

    const validateForm = () => {
        let currentErrors = {};
        let isValid = true;

        if (!username.trim()) {
            currentErrors.username = "Name is required.";
            isValid = false;
        }

        if (!area.trim() || isNaN(area) || parseFloat(area) <= 0) {
            currentErrors.area = "Enter a valid positive area.";
            isValid = false;
        }

        // Check if at least the first previous crop is selected (allow others to be empty)
        if (!previousCrops[0] || previousCrops[0].trim() === "") {
            currentErrors.previousCrops = "Please select at least one previous crop.";
            isValid = false;
        }

        const phonePattern = /^[1-9]\d{9}$/; // Simple 10-digit pattern
        if (!contactNum.trim() || !phonePattern.test(contactNum)) {
            currentErrors.contactNum = "Enter a valid 10-digit contact number.";
            isValid = false;
        }

        if (!address.trim()) {
            currentErrors.address = "Address is required.";
            isValid = false;
        }
        // Add checks for city/pincode if they become mandatory
        // if (!city.trim()) { /* ... */ }
        // if (!pincode.trim() || !/^\d{6}$/.test(pincode)) { /* ... */ }

        setErrors(currentErrors);
        return isValid;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        switch (name) {
            case "username": setUsername(value); break;
            case "area": setArea(value); break;
            case "measureScale": setMeasureScale(value); break;
            case "contactNum": setContactNum(value); break;
            case "address":
                setAddress(value);
                // Debounce this in a real app to avoid excessive API calls while typing
                // For simplicity here, call directly or on blur
                // updateMarkerFromAddress(value); // Option 1: Update map while typing address
                break;
             case "city": setCity(value); break;
             case "pincode": setPincode(value); break;
            default: break;
        }

        // Clear error for the field being typed into
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
        }
    };

    // Specific handler for address blur to update map
    const handleAddressBlur = (event) => {
        updateMarkerFromAddress(event.target.value);
    };

    const handlePreviousCropChange = (event, index) => {
        const updatedCrops = [...previousCrops];
        updatedCrops[index] = event.target.value;
        setPreviousCrops(updatedCrops);

        // Clear error for previousCrops if the first one is now selected
        if (index === 0 && event.target.value && errors.previousCrops) {
            setErrors(prevErrors => ({ ...prevErrors, previousCrops: undefined }));
        }
    };

    const submitPopUp = (event) => {
        event.preventDefault();

        if (!validateForm()) {
            // Find the first error and focus its input (optional enhancement)
            const firstErrorField = Object.keys(errors).find(key => errors[key]);
            const inputElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (inputElement) inputElement.focus();

            Swal.fire({
                title: "Validation Error",
                html: `Please fill all required fields correctly.<br/><small>${Object.values(errors).filter(e => e).join('<br/>')}</small>`, // Show specific errors
                icon: "error",
            });
            return;
        }

        Swal.fire({
            title: "Confirm Submission",
            text: "Are you sure you want to submit this farm data?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Submit!"
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmit(); // Proceed to the main submission logic
            }
        });
    };

    // --- Main Submit Logic ---
    const handleSubmit = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) {
            Swal.fire("Authentication Error", "User not signed in or email not available. Please login again.", "error");
            navigate("/login"); // Redirect to login
            return;
        }
        const userEmail = currentUser.email;

        // --- Show Initial Loading ---
        Swal.fire({
            title: "Processing...",
            text: "Submitting your farm data. Please wait.",
            icon: "info",
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // --- Prepare Form Data ---
        const farmDetailsFormData = new FormData();
        farmDetailsFormData.append("username", username);
        farmDetailsFormData.append("area", area);
        farmDetailsFormData.append("measureScale", measureScale);
        farmDetailsFormData.append("email", userEmail); // Add email
        farmDetailsFormData.append("previousCrops", JSON.stringify(previousCrops.filter(crop => crop.trim() !== ""))); // Send non-empty crops
        farmDetailsFormData.append("address", address);
        farmDetailsFormData.append("city", city);
        farmDetailsFormData.append("pincode", pincode);
        farmDetailsFormData.append("contactNum", contactNum);
        farmDetailsFormData.append("markerPosition", JSON.stringify(markerPosition));

        const fileInput = document.querySelector("input[type='file']"); // Ensure FileUploadPreview exposes files correctly if needed
        if (fileInput && fileInput.files.length > 0) {
            for (let i = 0; i < fileInput.files.length; i++) {
                farmDetailsFormData.append("reports", fileInput.files[i]);
            }
        }

        try {
            // --- Step 1: (Optional?) Create/Update Account ---
            // This seems like it should update, not create, or happen elsewhere.
            // Included here based on the class component's logic.
            Swal.update({ text: "Updating account details..." });
            try {
                const accountPayload = { // Send as JSON if API expects it
                    username: username,
                    email: userEmail,
                    address: address,
                    city: city,
                    pincode: pincode,
                    contactNum: contactNum
                };
                // Assuming API handles create or update based on email
                await axios.post(ACCOUNT_API_URL, accountPayload, {
                    headers: { "Content-Type": "application/json" } // Adjust content type if needed
                });
                console.log("✅ Account details updated/created.");
            } catch (accountError) {
                console.error("❌ Error updating/creating account:", accountError.response?.data || accountError.message);
                // Decide if this is a critical error or just a warning
                // Swal.fire("Account Error", "Could not update account details, but continuing submission.", "warning");
                // Or: throw new Error("Failed to update account"); // Stop submission
            }


            // --- Step 2: Submit Farm Data ---
            Swal.update({ text: "Saving farm details..." });
            const farmDataResponse = await axios.post(FARM_DATA_API_URL, farmDetailsFormData, {
                headers: { "Content-Type": "multipart/form-data" }, // Important for file uploads
            });

            if (farmDataResponse.status !== 200 && farmDataResponse.status !== 201) {
                 throw new Error(`Failed to save farm data (Status: ${farmDataResponse.status})`);
            }
            console.log("✅ Farm data saved successfully.");

            // --- Step 3: Fetch External Soil Data (ISRIC) ---
            Swal.update({ text: "Fetching soil properties..." });
            const userLat = markerPosition.lat;
            const userLng = markerPosition.lng;
            let soilApiResponse = await fetchSoilData(userLat, userLng); // Use robust fetcher

            const soilDataResult = { // Initialize with defaults
                soil_ph: null, soil_nitrogen: null, soil_phosphorus: null,
                soil_potassium: null, soil_moisture: null, soil_cec: null
            };

            if (soilApiResponse?.data?.properties?.layers) {
                 console.log("Processing fetched soil data...");
                 soilApiResponse.data.properties.layers.forEach(layer => {
                    if (layer.depths?.length > 0) {
                         const meanValue = layer.depths[0].values.mean;
                         if (meanValue !== null) {
                             switch (layer.name) {
                                 case "phh2o": soilDataResult.soil_ph = meanValue; break;
                                 case "nitrogen": soilDataResult.soil_nitrogen = meanValue; break;
                                 case "soc": soilDataResult.soil_phosphorus = meanValue; break; // Using SOC as proxy for P
                                 case "wv0010": soilDataResult.soil_moisture = meanValue; break;
                                 case "cec": soilDataResult.soil_cec = meanValue; break;
                                 case "potassium_extractable": soilDataResult.soil_potassium = meanValue; break;
                                 default: break;
                             }
                         }
                    }
                });
            } else {
                console.warn("⚠️ Could not fetch or process ISRIC soil data. Using defaults.");
                // Optionally show a specific warning to the user
            }

            // --- Step 4: (Optional?) Save Fetched Soil Data to Your Backend ---
            // Included based on class component logic
             try {
                Swal.update({ text: "Storing soil analysis..." });
                const soilSavePayload = {
                    userEmail: userEmail,
                    latitude: userLat,
                    longitude: userLng,
                    soilData: soilDataResult // Send the processed data
                };
                // Using axiosClient assuming it handles authentication
                const savedSoilResponse = await axiosClient.post(SOIL_SAVE_API_URL, soilSavePayload);
                console.log("✅ Soil data stored in own backend:", savedSoilResponse.data);
                setSoilData(savedSoilResponse.data.data?.soilData || soilDataResult); // Update local state if needed
             } catch (soilSaveError) {
                console.error("❌ Error saving soil data to own backend:", soilSaveError.response?.data || soilSaveError.message);
                // Decide if this is critical or a warning
             }

            // --- Step 5: Fetch Weather Data ---
            Swal.update({ text: "Fetching weather forecast..." });
            const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLng}&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&forecast_days=16`;
            const weatherResponse = await axios.get(weatherApi);
            const weatherDataDaily = weatherResponse.data.daily;
            const weatherDataHourly = weatherResponse.data.hourly;

            // --- Step 6: Fetch Elevation Data ---
            Swal.update({ text: "Fetching elevation data..." });
            const elevationApi = `https://api.open-meteo.com/v1/elevation?latitude=${userLat}&longitude=${userLng}`;
            const elevationRes = await axios.get(elevationApi);
            const elevation = elevationRes.data?.elevation?.[0] ?? null; // Handle potential missing elevation

            // --- Step 7: Aggregate Data for Recommendation ---
            Swal.update({ text: "Preparing data for analysis..." });

             // Calculate weather averages/min/max safely
             const safeAvg = (arr) => arr && arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
             const safeMin = (arr) => arr && arr.length > 0 ? Math.min(...arr) : null;
             const safeSum = (arr) => arr && arr.length > 0 ? arr.reduce((a, b) => a + b, 0) : null;

             const avgHourlyHumidity = safeAvg(weatherDataHourly?.relative_humidity_2m);
             const minHourlyHumidity = safeMin(weatherDataHourly?.relative_humidity_2m);

            const mergedData = {
                latitude: userLat,
                longitude: userLng,
                elevation: elevation, // Can be null
                // Use fetched soil data, defaulting to 0 or null if needed by API
                soil_ph: soilDataResult.soil_ph ?? 0, // Use null or default value as per API spec
                soil_nitrogen: soilDataResult.soil_nitrogen ?? 0,
                soil_phosphorus: soilDataResult.soil_phosphorus ?? 0,
                soil_potassium: soilDataResult.soil_potassium ?? 0,
                soil_moisture: soilDataResult.soil_moisture ?? 0,
                soil_cec: soilDataResult.soil_cec ?? 0,
                // Weather data - use safe calculations
                avg_temperature: safeAvg(weatherDataDaily?.temperature_2m_max) ?? 0,
                min_temperature: safeMin(weatherDataDaily?.temperature_2m_min) ?? 0,
                avg_humidity: avgHourlyHumidity ?? 0,
                min_humidity: minHourlyHumidity ?? 0,
                avg_wind_speed: safeAvg(weatherDataDaily?.wind_speed_10m_max) ?? 0,
                total_rainfall: safeSum(weatherDataDaily?.precipitation_sum) ?? 0,
                historical_crops: previousCrops.filter(crop => crop.trim() !== ""),
            };
            console.log("Merged Data for Recommendation:", mergedData);

            // --- Step 8: Get Recommendations ---
            Swal.update({ text: "Generating recommendations..." });
            // Note: The class component used POST with { data: mergedData }
            // The functional component used POST with mergedData directly.
            // Adjust based on the actual API requirement. Assuming direct POST:
             const recommendationResponse = await axios.post(RECOMMENDATION_API_URL, mergedData, {
                timeout: 30000 // Add timeout for recommendation service
            });

             if (recommendationResponse.status !== 200 && recommendationResponse.status !== 201) {
                 throw new Error(`Failed to get recommendations (Status: ${recommendationResponse.status})`);
             }
            const recommendationData = recommendationResponse.data;
            console.log("✅ Recommendation Response:", recommendationData);

            // --- Step 9: Final Success & Navigation ---
            Swal.close(); // Close loading Swal
            Swal.fire({
                title: "Success!",
                text: "Farm data submitted and recommendations are ready.",
                icon: "success",
                timer: 2000, // Auto close after 2 seconds
                showConfirmButton: false
            }).then(() => {
                // Store recommendation response data if needed (e.g., localStorage or context)
                // localStorage.setItem('recommendationData', JSON.stringify(recommendationData));
                navigate("/result", { state: { recommendations: recommendationData, farmDetails: { username, area, address } } }); // Pass recommendations via state
            });

            // Final Success Message
            Swal.fire({
                title: "Success",
                text: "Data processed and recommendations generated!",
                icon: "success"
            }).then(() => {
                 // Step 7: Navigate to result page
                 navigate("/result", { state: { recommendations: recommendationResponse.data,
                    weather: weatherDataDaily,
                    humidity: weatherDataHourly,
                    soil: soilApiResponse.data
                  } });
             });


        } catch (error) {
            console.error("❌ Error during submission process:", error);
            Swal.close(); // Close loading Swal

            let errorMessage = "An unexpected error occurred during submission. Please try again later.";
            if (error.response) {
                // Error from API call (axios error)
                errorMessage = `Server Error (${error.response.status}): ${error.response.data?.message || error.response.data?.error || error.message}`;
            } else if (error.request) {
                // Request made but no response received
                errorMessage = "Network Error: Could not connect to the server. Please check your connection.";
            } else if (error.message) {
                // Other errors (validation, setup, etc.)
                errorMessage = error.message;
            }

            Swal.fire("Submission Failed", errorMessage, "error");
        }
    };

    // ISRIC Soil Data Fetcher (from functional component - more robust)
    const fetchSoilData = async (lat, lng) => {
        let maxAttempts = 5;
        let offset = 0.005; // Start smaller offset
        let currentLat = lat;
        let currentLng = lng;

        for (let i = 0; i < maxAttempts; i++) {
            if (i > 0) { // Adjust coordinates only on retries
                 // Simple spiral out or alternating adjustment
                 const angle = (i / maxAttempts) * 2 * Math.PI; // Example: circular step out
                 currentLat = lat + offset * Math.sin(angle);
                 currentLng = lng + offset * Math.cos(angle);
                 offset += 0.002; // Increase search radius gradually
                console.log(`... Retrying at lat=${currentLat.toFixed(6)}, lng=${currentLng.toFixed(6)}`);
            } else {
                 console.log(`Attempt ${i + 1}: Fetching soil data at original lat=${currentLat.toFixed(6)}, lng=${currentLng.toFixed(6)}`);
            }

            try {
                const soilApi = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${currentLng}&lat=${currentLat}&properties=phh2o,nitrogen,soc,cec,wv0010,potassium_extractable&depth=0-5cm&value=mean`; // Request only mean
                const soilResponse = await axios.get(soilApi, { timeout: 15000 }); // Increased timeout

                console.log("Soil API Response Status:", soilResponse.status);
                 // console.log("Soil API Response Data:", soilResponse.data); // Log full response if needed

                const layers = soilResponse.data?.properties?.layers;
                if (soilResponse.status === 200 && layers && layers.length > 0) {
                    let hasValidData = false;
                    for (const layer of layers) {
                        // Check if depths array exists and has the 'mean' value we requested
                        if (layer.depths?.length > 0 && layer.depths[0].values?.mean !== null && layer.depths[0].values?.mean !== undefined) {
                             hasValidData = true;
                             break;
                        }
                    }

                    if (hasValidData) {
                        console.log("✅ ISRIC Soil Data Found:", soilResponse.data.properties);
                        return soilResponse; // Return the successful response
                    } else {
                        console.warn(`⚠️ Attempt ${i + 1}: Soil data structure OK, but all mean values are null/missing.`);
                    }
                } else {
                    console.warn(`⚠️ Attempt ${i + 1}: Soil API success status but data structure unexpected or no layers found.`);
                }

            } catch (error) {
                console.error(`❌ Error Fetching ISRIC Soil Data (Attempt ${i + 1}):`, error.message);
                if (error.code === 'ECONNABORTED') {
                     console.warn("Connection timed out. Retrying...");
                } else if (error.response) {
                     console.error("Error Response Status:", error.response.status);
                     // console.error("Error Response Data:", error.response.data);
                     if (error.response.status === 400 || error.response.status === 404) {
                          console.warn(`Coordinates likely out of bounds/no data. Trying nearby...`);
                     } else if (error.response.status >= 500) {
                          console.warn(`Soil API server error (${error.response.status}). Retrying...`);
                     } else {
                          console.error("Non-retriable API error.");
                          // return null; // Stop retrying for non-server/non-404 errors?
                     }
                } else if (error.request) {
                     console.error("No response received from Soil API. Network issue?");
                } else {
                     console.error("Error setting up Soil API request:", error.message);
                     return null; // Stop retrying for setup errors
                }
            }
             // Wait before retrying
            if (i < maxAttempts - 1) {
                 await new Promise(resolve => setTimeout(resolve, 1000 + i * 500)); // Exponential backoff basic
            }
        }

        console.error("❌ ISRIC Soil data could not be fetched after multiple attempts.");
        return null; // Return null after all attempts fail
    };

    const handleReturn = () => {
        navigate("/"); // Navigate home
    };

    // --- Render ---
    return (
        <div className="input-form-container"> {/* Consider renaming class if needed */}
            <button type="button" className="return-button" onClick={handleReturn}>
                ⮜ Home
            </button>
            <form onSubmit={submitPopUp} method="POST" noValidate> {/* Added noValidate to rely on custom validation */}
                <h1>Farm Details</h1>

                {/* Name Input */}
                <label htmlFor="username">Name<span className="required-fields">*</span>:</label>
                <input id="username" type="text" name="username" value={username} onChange={handleInputChange} placeholder="Enter your full name" required />
                {errors.username && <small className="error">{errors.username}</small>}

                {/* Area Input */}
                <label htmlFor="area">Farm Area<span className="required-fields">*</span>:</label>
                <div id="area-input" className="form-row"> {/* Use classes for styling rows */}
                    <input id="area" className="form-group" type="number" name="area" value={area} onChange={handleInputChange} placeholder="e.g., 10.5" step="any" min="0.01" required />
                    <select className="form-group" id="measure-scale" name="measureScale" value={measureScale} onChange={handleInputChange}>
                        <option value="Square meters">Square meters</option>
                        <option value="Hectare">Hectare</option>
                        <option value="Acre">Acre</option>
                        <option value="Bigha">Bigha</option> {/* Specify region if Bigha varies */}
                    </select>
                </div>
                {errors.area && <small className="error">{errors.area}</small>}

                {/* Previous Crops Input */}
                <label>Previous Crops (at least one)<span className="required-fields">*</span>:</label>
                <div id="previous-crops-input" className="form-row" style={{ gap: "10px" }}>
                    {previousCrops.map((crop, index) => (
                        <div key={index} style={{ flex: 1 }}>
                            <select
                                name={`previousCrop_${index}`} // Give unique name for potential label association
                                value={crop}
                                onChange={(event) => handlePreviousCropChange(event, index)}
                                style={{ width: "100%" }}
                                aria-label={`Previous Crop ${index + 1}`}
                                required={index === 0} // Only first is technically required by validation
                            >
                                <option value="">{index === 0 ? "Select Crop *" : "Select Crop (Optional)"}</option>
                                {cropOptions.map((cropOption, i) => (
                                    <option key={i} value={cropOption}>
                                        {cropOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
                {errors.previousCrops && <small className="error">{errors.previousCrops}</small>}

                {/* Contact Number Input */}
                <label htmlFor="contactNum">Contact Number<span className="required-fields">*</span>:</label>
                <input id="contactNum" type="tel" name="contactNum" value={contactNum} onChange={handleInputChange} placeholder="Enter 10-digit mobile number" maxLength="10" pattern="[1-9]{1}[0-9]{9}" required />
                {errors.contactNum && <small className="error">{errors.contactNum}</small>}

                 {/* Location Section */}
                 <label htmlFor="address">Farm Location Address<span className="required-fields">*</span>:</label>
                 <input
                    id="address"
                    type="text"
                    name="address"
                    value={address}
                    onChange={handleInputChange}
                    onBlur={handleAddressBlur} // Update map on blur
                    placeholder="Enter full address or nearest landmark"
                    required
                 />
                 {errors.address && <small className="error">{errors.address}</small>}

                 {/* City, Pincode, Current Location Button */}


                 {/* City, Pincode, Current Location Button */}
                 <div id="location-details-input" className="form-row">
                     {/* City Input */}
                     <input
                         className="form-group"
                         type="text"
                         name="city"
                         value={city}
                         onChange={handleInputChange}
                         placeholder="City/Town/Village"
                        //  required
                     />
                     {/* Pincode Input */}
                     <input
                         className="form-group"
                         type="text"
                         name="pincode"
                         value={pincode}
                         onChange={handleInputChange}
                         placeholder="Pin Code (6 digits)"
                         maxLength="6"
                         pattern="\d{6}"
                        //  required
                     />


                         <button
                             type="button"
                             className="use-current-location-btn" // Specific class for styling the button itself
                             onClick={useCurrentLocation}
                             title="Use My Current Location"
                             aria-label="Use My Current Location"
                             // style={{ flexShrink: 0 }} // flexShrink is now on the wrapper
                         >
                             <BiCurrentLocation size={20} />
                         </button>

                 </div>
                 {/* Add errors for city/pincode if needed */}
                 {/* {errors.city && <small className="error">{errors.city}</small>} */}
                 {/* {errors.pincode && <small className="error">{errors.pincode}</small>} */}          
                
                 <br/>

                 {/* Map Display */}
                 <label>Verify Location on Map:</label>
                 <div ref={mapRef} style={{ width: "100%", height: "350px", marginBottom: "20px", border: "1px solid #ccc" }}>
                     {/* Map is initialized here via useEffect */}
                 </div>

                {/* File Upload */}
                <label>Upload Soil Reports (Optional):</label>
                <FileUploadPreview /> {/* Ensure this component works as expected */}

                {/* Submit Button */}
                <button type="submit">Submit Farm Details</button>
            </form>

            {/* Optionally display fetched soil data for debugging/info */}
            {/* {soilData && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid lightblue' }}>
                    <h3>Fetched Soil Data (for info):</h3>
                    <pre>{JSON.stringify(soilData, null, 2)}</pre>
                </div>
            )} */}
        </div>
    );
}

export default InputForm;
// --- END OF MERGED FILE InputForm.js ---












































































































// import React, { Component, createRef, } from "react";
// import FileUploadPreview from "../getStarted/FileUploadPreview";
// import "../getStarted/css/InputForm.css";
// import L from "leaflet";

// import "leaflet/dist/leaflet.css";
// import { BiCurrentLocation } from "react-icons/bi";
// import Swal from 'sweetalert2';
// import axios from 'axios';
// import axiosClient from "../../utils/axiosInterceptor"
// import { auth } from "../../firebase"; // adjust the path if needed

// // const fetch = require("node-fetch");

// // const [soilData, setSoilData] = useState();

// class InputForm extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             username: "",
//             area: "",
//             measureScale: "Square meters",
//             previousCrops: ["", "", ""],
//             address: "",
//             city: "",
//             pincode: "",
//             contactNum: "",
//             markerPosition: { lat: 19.99675137006276, lng: 73.78974342339409 },
//             errors: {},
//             soilData: null,
//         };
//         this.mapRef = createRef();
//     }

//     cropOptions = [
//         "Adzuki Bean",
//         "Bajra (Pearl Millet)",
//         "Banana",
//         "Barley",
//         "Bengal Gram (Chickpea)",
//         "Black Gram (Urad)",
//         "Castor",
//         "Chickpea",
//         "Chili Pepper",
//         "Coconut",
//         "Common Bean",
//         "Coriander",
//         "Corn (Maize)",
//         "Cotton",
//         "Cowpea (Lobia)",
//         "Cumin",
//         "Eggplant (Brinjal)",
//         "Finger Millet (Ragi)",
//         "Foxtail Millet (Kangni)",
//         "Garlic",
//         "Ginger",
//         "Green Gram (Moong)",
//         "Groundnut (Peanut)",
//         "Guar (Cluster Bean)",
//         "Indian Mustard (Sarson)",
//         "Jowar (Sorghum)",
//         "Jute",
//         "Kidney Bean (Rajma)",
//         "Lentil (Masoor)",
//         "Little Millet (Kutki)",
//         "Mango",
//         "Moth Bean",
//         "Mustard",
//         "Niger Seed",
//         "Okra (Bhindi)",
//         "Onion",
//         "Pigeon Pea (Arhar/Toor)",
//         "Potato",
//         "Rice",
//         "Sesame (Gingelly/Til)",
//         "Sorghum (Jowar)",
//         "Soybean",
//         "Sugarcane",
//         "Sunflower",
//         "Sweet Potato",
//         "Tamarind",
//         "Turmeric",
//         "Wheat",
//         "Yam",
//         "Zucchini"
//     ];
    
//     componentDidMount() {
//         if (this.map) return;
//         this.map = L.map(this.mapRef.current).setView(
//             [this.state.markerPosition.lat, this.state.markerPosition.lng],
//             13
//         );

//         // Add OpenStreetMap tile layer
//         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//             attribution: '&copy; OpenStreetMap contributors',
//         }).addTo(this.map);

//         delete L.Icon.Default.prototype._getIconUrl;

//         const currentLocationIcon = `<img width="30" height="30" src="https://img.icons8.com/external-those-icons-lineal-color-those-icons/30/external-pin-maps-and-locations-those-icons-lineal-color-those-icons-3.png" alt="external-pin-maps-and-locations-those-icons-lineal-color-those-icons-3"/>`;

//         const customIcon = L.divIcon({
//             html: currentLocationIcon,
//             className: "leaflet-custom-icon",
//             iconSize: [30, 30],
//             iconAnchor: [15, 30],
//         });

//         // Add draggable marker at default location with custom icon
//         this.marker = L.marker(
//             [this.state.markerPosition.lat, this.state.markerPosition.lng],
//             { draggable: true, icon: customIcon }
//         ).addTo(this.map);

//         // Update state and address on marker drag
//         this.marker.on("dragend", () => {
//             const { lat, lng } = this.marker.getLatLng();
//             this.setState({ markerPosition: { lat, lng } });
//             this.getAddressFromCoordinates(lat, lng);
//         });

//         // Update marker position on map click
//         this.map.on("click", (event) => {
//             const { lat, lng } = event.latlng;
//             this.marker.setLatLng([lat, lng]);
//             this.setState({ markerPosition: { lat, lng } });
//             this.getAddressFromCoordinates(lat, lng);
//         });
//     }

//     getAddressFromCoordinates = async (lat, lon) => {
//         try {
//             const response = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
//             );
//             const data = await response.json();

//             if (data && data.display_name) {
//                 const addressParts = data.address || {};
//                 const city =
//                     addressParts.city ||
//                     addressParts.town ||
//                     addressParts.village ||
//                     addressParts.state_district ||
//                     addressParts.county ||
//                     addressParts.region ||
//                     addressParts.state ||
//                     "Unknown";

//                 this.setState({
//                     address: data.display_name,
//                     city: city,
//                     pincode: addressParts.postcode || "",
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching address:", error);
//         }
//     };


//     // Get current location using Geolocation API
//     useCurrentLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     this.marker.setLatLng([latitude, longitude]);
//                     this.map.setView([latitude, longitude], 13);
//                     this.setState({ markerPosition: { lat: latitude, lng: longitude } });
//                     this.getAddressFromCoordinates(latitude, longitude);
//                 },
//                 () => {
//                     alert("Error fetching current location.");
//                 }
//             );
//         } else {
//             alert("Geolocation is not supported by this browser.");
//         }
//     };

//     updateMarkerFromAddress = async (address) => {
//         if (!address.trim()) return;

//         try {
//             const response = await fetch(
//                 `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
//             );
//             const data = await response.json();

//             if (data.length > 0) {
//                 const { lat, lon } = data[0];
//                 this.marker.setLatLng([lat, lon]);
//                 this.map.setView([lat, lon], 13);
//                 this.setState({ markerPosition: { lat, lng: lon } });
//             }
//         } catch (error) {
//             console.error("Error fetching location:", error);
//         }
//     };

//     // Code for Form Validations
//     validateForm = () => {
//         let errors = {};
//         let isValid = true;

//         if (!this.state.username.trim()) {
//             errors.username = "Name is required.";
//             isValid = false;
//         }

//         if (!this.state.area.trim() || isNaN(this.state.area) || this.state.area <= 0) {
//             errors.area = "Enter a valid area.";
//             isValid = false;
//         }

//         if (this.state.soilType === "Select Soil") {
//             errors.soilType = "Please select a soil type.";
//             isValid = false;
//         }

//         const phonePattern = /^[1-9]\d{9}$/;
//         if (!this.state.contactNum.trim() || !phonePattern.test(this.state.contactNum)) {
//             errors.contactNum = "Enter a valid 10-digit contact number.";
//             isValid = false;
//         }

//         if (!this.state.address.trim()) {
//             errors.address = "Address is required.";
//             isValid = false;
//         }

//         this.setState({ errors });
//         return isValid;
//     };


//     handleInputChange = async (event) => {
//         this.setState({ [event.target.name]: event.target.value });

//         if (this.state.errors[event.target.name]) {
//             let errors = { ...this.state.errors };
//             delete errors[event.target.name];
//             this.setState({ errors });
//         }

//         if (event.target.name === "address") {
//             this.updateMarkerFromAddress(event.target.value);
//         }
//     };

//     submitPopUp(event) {
//         event.preventDefault();

//         if (!this.validateForm()) {
//             Swal.fire({
//                 title: "Validation Error",
//                 text: "Please fill all required fields correctly.",
//                 icon: "error",
//             });
//             return;
//         }

//         Swal.fire({
//             title: "Are you sure?",
//             text: "You want to submit data?",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Submit"
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 Swal.fire({
//                     title: "Submitted",
//                     text: "Your data has been submitted successfully !!!",
//                     icon: "success"
//                 }).then(() => {
//                     this.handleSubmit(event)
//                 }
//                 );
//             }
//         });
//     }


//     handleSubmit = async (event) => {
//         event.preventDefault();
//         console.log("Form Data:", this.state);
      
//         const formData = new FormData();
//         const account = new FormData()

//         const currentUser = auth.currentUser;
//         if (!currentUser || !currentUser.email) {
//         Swal.fire("Error", "User not signed in. Please login again.", "error");
//         return;
//         }
//         const userEmail = currentUser.email;

//         formData.append("username", this.state.username);
//         account.append("username", this.state.username);

//         formData.append("area", this.state.area);
//         formData.append("measureScale", this.state.measureScale);

//         formData.append("email", userEmail);  // ✅ Add email field
//         account.append("email", userEmail);

//         formData.append("previousCrops", JSON.stringify(this.state.previousCrops));
        
//         formData.append("address", this.state.address);
//         account.append("address", this.state.address);

//         formData.append("city", this.state.city);
//         account.append("city", this.state.city);

//         formData.append("pincode", this.state.pincode);
//         account.append("pincode", this.state.pincode);

//         formData.append("contactNum", this.state.contactNum)
//         account.append("contactNum", this.state.contactNum)

//         let userLocation = JSON.stringify(this.state.markerPosition);
//         formData.append("markerPosition", JSON.stringify(this.state.markerPosition));
      
//         const fileInput = document.querySelector("input[type='file']");
//         if (fileInput && fileInput.files.length > 0) {
//           for (let i = 0; i < fileInput.files.length; i++) {
//             formData.append("reports", fileInput.files[i]);
//           }
//         }

//         try {
//             const response = await axios.post("https://final-year-precision-farming-deployed.vercel.app/api/account/create-account", account,{
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               }
//             });
        
//             const result = await response.json();
        
//             if (response.ok) {
//               console.log("✅ Account created:", result.data);
//             } else {
//               console.error("❌ Error:", result.message);
//             }
//           } catch (error) {
//             console.error("🚨 Network error:", error);
//           }
      

//         try {
//           const response = await axios.post("https://backend-dev-deployed.vercel.app/api/submit-farm-data", formData, {
//             headers: {
//               "Content-Type": "multipart/form-data"              
//             },
//           });
      
//           if (response.status === 200 || response.status === 201) {
//             Swal.fire("Success", "Data saved successfully!", "success");

//             let parsedUserLocation = JSON.parse(userLocation);
//             let userLat = parsedUserLocation.lat;
//             let userLng = parsedUserLocation.lng;

//             // Step 2: Fetch soil data (with nearby location check)
//             let soilData = await this.fetchSoilData(userLat, userLng);
//             // if (!soilData) {
//             //     Swal.fire("Error", "Failed to fetch soil data.", "error");
//             //     return;
//             // }

//             setTimeout(() => {
//             }, 10000);

//             const soilDataResponse = {
//                 soil_ph: 0,
//                 soil_nitrogen: 0,
//                 soil_phosphorus: 0,
//                 soil_potassium: 0,
//                 soil_moisture: 0,
//                 soil_cec: 0,
//             };
//             // debugger
//             soilData.data.properties.layers.forEach(layer => {
//                 if (layer.depths?.length > 0) {
//                   const meanValue = layer.depths[0].values.mean;
              
//                   switch (layer.name) {
//                     case "phh2o":
//                         soilDataResponse.soil_ph = meanValue;
//                       break;
//                     case "nitrogen":
//                         soilDataResponse.soil_nitrogen = meanValue;
//                       break;
//                     case "soc":
//                         soilDataResponse.soil_phosphorus = meanValue;
//                       break;
//                     case "wv0010":
//                         soilDataResponse.soil_moisture = meanValue;
//                       break;
//                     case "cec":
//                         soilDataResponse.soil_cec = meanValue;
//                       break;
//                     case "potassium_extractable": 
//                     soilDataResponse.soil_potassium = meanValue; 
//                       break;
//                   }
//                 }
//               });
              

//             // Step 3: Fetch weather data
//             const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLng}&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&forecast_days=16`;
//             const weatherResponse = await axios.get(weatherApi);
//             const weatherData = weatherResponse.data.daily;
//             const humidityData = weatherResponse.data.hourly.relative_humidity_2m;

//             console.table(weatherData)
//             console.table(humidityData)

//             // Step 3: Merge Data
//             const mergedData = {
//                 latitude: userLat,
//                 longitude: userLng,
//                 soil_ph: soilDataResponse.soil_ph || 0,
//                 soil_nitrogen: soilDataResponse.soil_nitrogen || 0,
//                 soil_phosphorus: soilDataResponse.soil_phosphorus || 0,
//                 soil_potassium: soilDataResponse.soil_potassium || 0,
//                 soil_moisture: soilDataResponse.soil_moisture || 0,
//                 soil_cec: soilDataResponse.soil_cec || 0,
//                 avg_temperature: weatherData.temperature_2m_max.reduce((a, b) => a + b, 0) / weatherData.temperature_2m_max.length,
//                 min_temperature: Math.min(...weatherData.temperature_2m_min),
//                 avg_humidity: humidityData.reduce((a, b) => a + b, 0) / humidityData.length,
//                 min_humidity: Math.min(...humidityData),
//                 avg_wind_speed: weatherData.wind_speed_10m_max.reduce((a, b) => a + b, 0) / weatherData.wind_speed_10m_max.length,
//                 total_rainfall: weatherData.precipitation_sum.reduce((a, b) => a + b, 0),
//                 historical_crops: this.state.previousCrops,
//             };

//             console.log("Merged Data:", mergedData);

//             const storeResponse = await axios.post("https://dangerous-sabina-precision-farming-23844e94.koyeb.app/recommend", {
//                 data: mergedData
//             });

//             if (storeResponse.status === 200 || storeResponse.status === 201) {
//                 console.log("Merged Data Stored Successfully:", storeResponse.data);
//             } else {
//                 console.error("Failed to store merged data:", storeResponse.data);
//             }

//         }else {
//             Swal.fire("Error", response.data.error || "Failed to save data", "error");
//           }
//         } catch (error) {
//           console.error("Error submitting form:", error);
//           Swal.fire("Error", "Server error. Try again later.", "error");
//         }


//         // SUJAL Soil Data API Call
//         try {
//             const { lat, lng } = this.state.markerPosition;
              
//               const currentUser = auth.currentUser;
//               if (!currentUser) {
//               console.warn("⚠️ No authenticated user found!");
//               return;
//               }
        
//             const requestPromise = axiosClient.post("https://final-year-precision-farming-deployed.vercel.app/api/soil/save-soil-data", {
//               userEmail: currentUser.email,
//               latitude: lat,
//               longitude: lng,
//             });
        
//             const timeoutPromise = new Promise((_, reject) =>
//               setTimeout(() => reject(new Error("⏱ Request timed out after 20 seconds")), 20000)
//             );
        
//             const response = await Promise.race([requestPromise, timeoutPromise]);
        
//             const savedData = response.data.data;
//             console.log("✅ Soil data stored & returned:", savedData);
        
//             this.setState({ soilData: savedData.soilData });
//             if (this.props.onSoilDataUpdate) {
//               this.props.onSoilDataUpdate(savedData.soilData);
//             }
//           } catch (error) {
//             console.error("❌ Failed to fetch/store soil data:", error.message);
//           }

      

//      };
      

      
//       fetchSoilData = async (lat, lng) => {
//         let maxAttempts = 5;
//         let offset = 0.01;
        
//         for (let i = 0; i < maxAttempts; i++) {
//             try {
//                 console.log(`Attempt ${i + 1}: Fetching soil data at lat=${lat}, lng=${lng}`);
//                 const soilApi = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lng}&lat=${lat}&properties=phh2o,nitrogen,soc,cec,wv0010,potassium_extractable&depth=0-5cm`;
//                 const soilResponse = await axios.get(soilApi);
                
//                 console.log("Soil API Response:", soilResponse.data); // Log full response
                
//                 if (soilResponse.status === 200 && soilResponse.data && soilResponse.data.properties) {
//                     console.log("✅ Soil Data Found:", soilResponse.data.properties);
//                     return soilResponse;
//                 } else if (soilResponse.status === 200 && soilResponse.data.properties.layers[0].depths[0].values.mean === null) {
//                     console.warn("⚠️ Data Not available for these coordinates...");
//                 }
//             } catch (error) {
//                 console.error("❌ Error Fetching Soil Data:", error);
//                 if (error.response && error.response.status === 500) {
//                     console.warn(`⚠️ Attempt ${i + 1}: Soil API failed. Retrying with nearby location...`);
//                 } else {
//                     return null;
//                 }
//             }
            
//             // Adjust lat and lng for next attempt
//             lat += (i % 2 === 0 ? offset : -offset);
//             lng += (i % 2 === 0 ? offset : -offset);
//             offset += 0.01; // Increase offset to expand search radius
//             console.log("... Trying for lat:" + lat + " & lng:" + lng);
//         }
        
//         console.error("❌ Soil data could not be fetched after multiple attempts.");
//         return null;
//     };


//     handleReturn = () => {
//         window.location.href = "/";
//     };

//     render() {
//         return (
//             <div className="getStarted">
//             <div className="input-form-container">
//                 <button type="button" className="return-button" onClick={this.handleReturn}>
//                     ⮜ Home
//                 </button>
//                 <form onSubmit={(event) => this.submitPopUp(event)} method="POST">
//                     <h1>Farm Details</h1>

//                     <label>Name<span className="required-fields">*</span>:</label>
//                     <input type="text" style={{width : "41rem"}} name="username" value={this.state.username} onChange={this.handleInputChange} placeholder="Name..." />
//                     {this.state.errors.username && <small className="error">{this.state.errors.username}</small>}

//                     <label>Farm Area<span className="required-fields">*</span>:</label>
//                     <div id="area-input">
//                         <input className="form-group" type="number" name="area" value={this.state.area} onChange={this.handleInputChange} placeholder="Area..." />
//                         <select className="form-group" id="measure-scale" name="measureScale" value={this.state.measureScale} onChange={this.handleInputChange}>
//                             <option value="Square meters">Square meters</option>
//                             <option value="Hectare">Hectare</option>
//                             <option value="Acre">Acre</option>
//                             <option value="Bigha">Bigha</option>
//                         </select>
//                     </div>
//                     {this.state.errors.area && <small className="error">{this.state.errors.area}</small>}

//                     <label>Previous Crops<span className="required-fields">*</span> :</label>
//                     <div id="previous-crops-input" style={{ display: "flex", gap: "5px", width: "100%" }}>
//                         {this.state.previousCrops.map((crop, index) => (
//                             <div key={index}>
//                                 <select
//                                     value={crop}
//                                     onChange={(event) => {
//                                         let updatedCrops = [...this.state.previousCrops];
//                                         updatedCrops[index] = event.target.value;
//                                         this.setState({ previousCrops: updatedCrops });
//                                     }}
//                                     style={{
//                                         width: "13.5rem",
//                                         maxHeight: "150px",         // height for 5 items approx.
//                                         overflowY: "auto",          // add vertical scroll
//                                         position: "relative",       // allow positioning
//                                         zIndex: 1                   // ensure it's above if overlapping
//                                     }}
//                                 >
//                                     <option value="">Select Crop</option>
//                                     {this.cropOptions.map((cropOption, i) => (
//                                         <option key={i} value={cropOption}>
//                                             {cropOption}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         ))}
//                     </div>

               
//                     <label>Contact Number<span className="required-fields">*</span>:</label>
//                     <input type="text" name="contactNum"  style={{width : "41rem"}} value={this.state.contactNum} onChange={this.handleInputChange} placeholder="Enter contact number" />
//                     {this.state.errors.contactNum && <small className="error">{this.state.errors.contactNum}</small>}

//                     <label>Select Farm Location<span className="required-fields">*</span>:</label>
//                     <input type="text" name="address"  style={{width : "41rem"}} value={this.state.address} onChange={this.handleInputChange} placeholder="Enter address" />
//                     {this.state.errors.address && <small className="error">{this.state.errors.address}</small>}

//                     <div id="area-input">
//                         <input
//                             className="form-group"
//                             type="text"
//                             name="city"
//                             value={this.state.city}
//                             onChange={this.handleInputChange}
//                             placeholder="Enter city"
//                         />
//                         <input
//                             className="form-group"
//                             type="text"
//                             name="pincode"
//                             value={this.state.pincode}
//                             onChange={this.handleInputChange}
//                             placeholder="Enter pin code"
//                         />
//                         <button
//                             type="button"
//                             className="use-current-location-btn"
//                             onClick={this.useCurrentLocation}
//                             title="Current Location"
//                         >
//                             <BiCurrentLocation size={24} />
//                         </button>
//                     </div>

//                     <div ref={this.mapRef} style={{ width: "100%", height: "400px", marginBottom: "20px" }}></div>

//                     <label>Reports (if any):</label>
//                     <FileUploadPreview />

//                     <button type="submit">Submit</button>
//                 </form>
//             </div>
        
//             {/* {this.state.soilData && <SoilInfo soilData={this.state.soilData} />} */}
//             {/* {this.state.soilData ? <SoilInfo soilData={this.state.soilData} /> : <p>Loading soil data...</p>} */}

//             </div>
//         );
//     }
// }

// export default InputForm;
