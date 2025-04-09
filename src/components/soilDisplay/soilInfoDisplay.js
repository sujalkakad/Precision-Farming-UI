

// components/soilDisplay/soilInfoDisplay.js
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";
import { auth } from "../../firebase";

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

  if (loading) return <p>Loading soil data...</p>;

  return (
    <div className="soil-info-container" style={{ padding: "20px" }}>
      <h2>Soil Data</h2>
      {soilData.length === 0 ? (
        <p>No soil data found for this account.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {soilData.map((entry, index) => (
            <li
              key={index}
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <p><strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
              <p><strong>Latitude:</strong> {entry.latitude}</p>
              <p><strong>Longitude:</strong> {entry.longitude}</p>
              <p><strong>Soil pH:</strong> {entry.soilData.soil_ph}</p>
              <p><strong>Moisture:</strong> {entry.soilData.soil_moisture}</p>
              <p><strong>Nitrogen:</strong> {entry.soilData.soil_nitrogen}</p>
              <p><strong>Carbon:</strong> {entry.soilData.soil_carbon}</p>
              <p><strong>CEC:</strong> {entry.soilData.soil_cec}</p>
              <p><strong>Potassium:</strong> {entry.soilData.soil_potassium}</p>
            </li>
          ))}
        </ul>
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
