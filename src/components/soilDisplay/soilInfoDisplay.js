import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import { auth } from "../../firebase";
import "./SoilInfo.css"; // We'll create this CSS file separately

function SoilInfo() {
  const [soilData, setSoilData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoilData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("https://final-year-precision-farming-deployed.vercel.app/api/soil/GetSoilData", {
          params: { email: currentUser.email },
        });

        console.log("📦 Soil data fetched:", response.data);
        setSoilData(response.data);
      } catch (error) {
        console.error("❌ Error fetching soil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoilData();
  }, []);

  const getSoilStatus = (value, type) => {
    // Define thresholds for different soil parameters
    const thresholds = {
      soil_ph: { low: 5.5, high: 7.5 }, // pH below 5.5 is low, above 7.5 is high
      soil_moisture: { low: 30, high: 60 }, // % below 30 is low, above 60 is high
      soil_nitrogen: { low: 20, high: 40 }, // ppm below 20 is low, above 40 is high
      soil_carbon: { low: 1, high: 2.5 }, // % below 1 is low, above 2.5 is high
      soil_cec: { low: 10, high: 20 }, // meq/100g below 10 is low, above 20 is high
      soil_potassium: { low: 150, high: 250 }, // ppm below 150 is low, above 250 is high
      soil_phosphorous: { low: 15, high: 30 }, // ppm below 15 is low, above 30 is high
      soil_magnesium: { low: 50, high: 100 }, // ppm below 50 is low, above 100 is high
    };

    // Special case for pH which has a different scale
    if (type === 'soil_ph') {
      if (value < thresholds.soil_ph.low) return "low";
      if (value > thresholds.soil_ph.high) return "low"; // Both too acidic and too alkaline are problematic
      return "high"; // Neutral pH is ideal
    }

    // For all other parameters
    const threshold = thresholds[type] || { low: 0, high: 100 };
    
    if (value < threshold.low) return "low";
    if (value > threshold.high) return "high";
    return "medium";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "low": return { backgroundColor: "#fee2e2", borderColor: "#fca5a5" };
      case "medium": return { backgroundColor: "#fef3c7", borderColor: "#fcd34d" };
      case "high": return { backgroundColor: "#d1fae5", borderColor: "#6ee7b7" };
      default: return { backgroundColor: "#f3f4f6", borderColor: "#d1d5db" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "low":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "24px", width: "24px", color: "#ef4444" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "medium":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "24px", width: "24px", color: "#f59e0b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "high":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "24px", width: "24px", color: "#10b981" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getParameterName = (key) => {
    const names = {
      soil_ph: "pH",
      soil_moisture: "Moisture",
      soil_nitrogen: "Nitrogen",
      soil_carbon: "Carbon",
      soil_cec: "CEC",
      soil_potassium: "Potassium",
      soil_phosphorous: "Phosphorus",
      soil_magnesium: "Magnesium"
    };
    return names[key] || key;
  };

  const getUnit = (key) => {
    const units = {
      soil_ph: "",
      soil_moisture: "%",
      soil_nitrogen: "ppm",
      soil_carbon: "%",
      soil_cec: "meq/100g",
      soil_potassium: "ppm",
      soil_phosphorous: "ppm",
      soil_magnesium: "ppm"
    };
    return units[key] || "";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <div className="loading-animation">
          <div className="loading-circle"></div>
          <div className="loading-text">Loading soil data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#255F38", marginBottom: "24px" }}>Soil Analysis Results</h2>
      
      {soilData.length === 0 ? (
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "24px", 
          borderRadius: "8px", 
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", 
          border: "1px solid #e5e7eb",
          textAlign: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "48px", width: "48px", color: "#9ca3af", marginRight: "12px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={{ fontSize: "18px", color: "#4b5563" }}>No soil data found for this account.</p>
          </div>
          <p style={{ marginTop: "16px", color: "#6b7280" }}>Either You are Not Sign In. <br/> OR <br/>   Click On "Get Started" And Enter Your Correct Location with Logined Email To See Your Soil Data.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {soilData.map((entry, index) => (
            <div key={index} style={{ 
              backgroundColor: "#ffffff", 
              borderRadius: "8px", 
              overflow: "hidden", 
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", 
              border: "1px solid #e5e7eb" 
            }}>
              <div style={{ backgroundColor: "#166534", color: "#ffffff", padding: "16px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>Sample #{index + 1}</h3>
                  <p style={{ color: "#dcfce7", margin: 0 }}>{formatDate(entry.createdAt)}</p>
                </div>
                <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "16px", width: "16px", marginRight: "4px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Lat: {entry.latitude.toFixed(6)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "16px", width: "16px", marginRight: "4px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Long: {entry.longitude.toFixed(6)}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ padding: "16px" }}>
                <div className="soil-parameters-grid">
                  {Object.entries(entry.soilData).map(([key, value]) => {
                    const status = getSoilStatus(value, key);
                    const statusColor = getStatusColor(status);
                    
                    return (
                      <div 
                        key={key} 
                        style={{ 
                          backgroundColor: statusColor.backgroundColor,
                          borderColor: statusColor.borderColor,
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderRadius: "8px",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.2s ease",
                        }}
                        className="soil-parameter-card"
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <h4 style={{ fontWeight: "500", color: "#1f2937", margin: 0 }}>{getParameterName(key)}</h4>
                          {getStatusIcon(status)}
                        </div>
                        
                        <div style={{ marginTop: "auto" }}>
                          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#374151", margin: 0 }}>
                            {value}{getUnit(key)}
                          </p>
                          <p style={{ fontSize: "14px", textTransform: "capitalize", color: "#4b5563", marginTop: "4px", margin: 0 }}>
                            {status === "low" ? "Low" : status === "medium" ? "Optimal" : "High"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div style={{ 
                  marginTop: "24px", 
                  backgroundColor: "#f9fafb", 
                  padding: "16px", 
                  borderRadius: "6px", 
                  border: "1px solid #e5e7eb" 
                }}>
                  <h4 style={{ fontWeight: "500", color: "#374151", marginBottom: "8px", margin: 0 }}>Recommendations</h4>
                  <ul style={{ fontSize: "14px", color: "#4b5563", paddingLeft: "16px", margin: "8px 0 0" }}>
                    {Object.entries(entry.soilData).map(([key, value]) => {
                      const status = getSoilStatus(value, key);
                      if (status === "low" || status === "high") {
                        return (
                          <li key={`rec-${key}`} style={{ marginBottom: "8px" }}>
                            {status === "low" ? (
                              <span>Consider increasing {getParameterName(key).toLowerCase()} levels through appropriate amendments.</span>
                            ) : (
                              <span>Monitor high {getParameterName(key).toLowerCase()} levels and adjust farming practices accordingly.</span>
                            )}
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SoilInfo;





// // components/soilDisplay/soilInfoDisplay.js
// import React, { useEffect, useState, useContext } from "react";
// import axios from "../../utils/axiosInterceptor";
// import { auth } from "../../firebase";

// function SoilInfo() {
//   const [soilData, setSoilData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSoilData = async () => {
//       const currentUser = auth.currentUser;

//       if (!currentUser) {
//         console.log("User not authenticated");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`/api/soil`, {
//           params: { email: currentUser.email },
//         });

//         setSoilData(response.data);
//       } catch (error) {
//         console.error("Error fetching soil data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSoilData();
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="soil-info-container">
//       <h2>Soil Data</h2>
//       {soilData.length === 0 ? (
//         <p>No soil data found.</p>
//       ) : (
//         <ul>
//           {soilData.map((item, index) => (
//             <li key={index}>
//               <strong>Date:</strong> {item.date}<br />
//               <strong>pH:</strong> {item.ph}<br />
//               <strong>Moisture:</strong> {item.moisture}<br />
//               <strong>Nitrogen:</strong> {item.nitrogen}
//               {/* Render other relevant soil info */}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default SoilInfo;
