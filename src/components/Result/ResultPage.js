import React from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Result.css"; // Make sure this file exists or remove the import

function ResultPage() {
  const location = useLocation();
  // Use optional chaining and default to empty objects/arrays for safety
  // Destructure the state assuming keys are recommendations, weatherData, and soilData
  const { recommendations, weatherData, soilData } = location.state || {};

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Precision Farming Report", 14, 15);

    let currentY = 30; // Starting Y position for content

    // --- Add Weather Data to PDF ---
    // doc.setFontSize(12);
    // doc.text("Weather Info", 14, currentY);
    // currentY += 8; // Space after title
    // if (weatherData && Object.keys(weatherData).length > 0) {
    //   Object.entries(weatherData).forEach(([key, value]) => {
    //     doc.text(${key}: ${value}, 14, currentY);
    //     currentY += 6; // Space between lines
    //   });
    //   currentY += 10; // Space after weather section
    // } else {
    //   doc.text("No weather data available.", 14, currentY);
    //   currentY += 16; // Space for the message and gap
    // }

    // --- Add Soil Data to PDF ---
    doc.text("Soil Data", 14, currentY);
    currentY += 8; // Space after title

    // Check if soil data exists and has the expected structure
    if (soilData && soilData.properties && soilData.properties.layers && soilData.properties.layers.length > 0) {
      const soilTableBody = [];
      // Define table headers
      const soilTableHead = ["Layer", "Depth", "Metric", "Value", "Unit"];

      // Iterate through each soil layer
      soilData.properties.layers.forEach(layer => {
        // Extract the d_factor and target units from the layer's unit_measure
        const dFactor = layer.unit_measure.d_factor;
        const targetUnits = layer.unit_measure.target_units;

        // Iterate through each depth within the layer
        layer.depths.forEach(depth => {
          const depthLabel = depth.label;

          // Iterate through each value (mean, Q0.5, etc.) for this depth
          Object.entries(depth.values).forEach(([valueName, rawValue]) => {
             // --- Conversion Step ---
             // Raw value is in mapped_units, divide by d_factor to get target_units
             // Handle potential division by zero or null dFactor defensively
             const convertedValue = (dFactor != null && dFactor !== 0 && typeof rawValue === 'number') ? rawValue / dFactor : rawValue;
             // Format the converted value for display (adjust precision if needed)
             // Use toFixed() for numbers, keep others as is
             const formattedValue = typeof convertedValue === 'number' ? convertedValue.toFixed(3) : convertedValue; // Increased precision slightly

            // Add a row to the PDF table body
            soilTableBody.push([
              layer.name,
              depthLabel,
              valueName, // e.g., "mean", "Q0.5"
              formattedValue, // The converted value
              targetUnits // The units after conversion
            ]);
          });
           // Optionally add uncertainty to the table if present, without conversion as no factor/unit is provided
           if (depth.values.uncertainty !== undefined) {
              soilTableBody.push([
                layer.name,
                depthLabel,
                "uncertainty",
                depth.values.uncertainty, // Display raw uncertainty
                "" // No unit provided for uncertainty in the JSON
              ]);
           }
        });
      });

      // Generate the soil data table in the PDF
      if (soilTableBody.length > 0) {
        autoTable(doc, {
          startY: currentY,
          head: [soilTableHead],
          body: soilTableBody,
          // Optional: Add some basic styling to the table
          styles: { fontSize: 7, cellPadding: 1 }, // Smaller font/padding for dense data
          headStyles: { fillColor: [200, 200, 200], textColor: 50 },
          margin: { top: currentY, left: 14, right: 14 } // Adjust margin as needed
        });
         // Update currentY to be below the generated table
        currentY = doc.lastAutoTable.finalY + 10;
      } else {
           doc.text("No detailed soil layer data available.", 14, currentY);
           currentY += 16;
      }

    } else {
      doc.text("No soil data available.", 14, currentY);
      currentY += 16;
    }


    // --- Add Crop Recommendations to PDF ---
    doc.text("Crop Recommendations", 14, currentY);
    currentY += 8;

    // Prepare data for the crop recommendations table
    const cropTableBody = recommendations?.recommendations.map((crop) => [
      crop.crop_name,
      crop.growing_info.growing_season,
      (crop.expected_yield.in_tons_per_acre || 'N/A') + " tons/acre", // Add units and handle potential missing value
    ]) || [];

    // Generate the crop recommendations table in the PDF
    if (cropTableBody.length > 0) {
         autoTable(doc, {
          startY: currentY,
          head: [["Crop", "Season", "Expected Yield"]], // Changed column header for clarity
          body: cropTableBody,
           styles: { fontSize: 8, cellPadding: 1 },
           headStyles: { fillColor: [200, 200, 200], textColor: 50 },
           margin: { top: currentY, left: 14, right: 14 }
        });
        currentY = doc.lastAutoTable.finalY + 10;
    } else {
        doc.text("No crop recommendations available.", 14, currentY);
        currentY += 16;
    }


    // Save the PDF
    doc.save("farming_report.pdf");
  };

  // Add a check for required data before rendering the main content
  // You might adjust this condition based on what data is considered essential
  if (!recommendations && !weatherData && (!soilData || !soilData.properties || !soilData.properties.layers || soilData.properties.layers.length === 0)) {
     return <p className="no-data">Loading data or no data available.</p>;
  }


  return (
    <div className="result-container">
      <h2 className="title">Precision Farming Report</h2>

      {/* --- Weather Info Section --- */}
      <section className="info-section">
        <h3>Weather Info</h3>
        {weatherData && Object.keys(weatherData).length > 0 ? (
          <ul>
            {/* Map through key-value pairs of weatherData object */}
            {Object.entries(weatherData).map(([key, value], index) => (
              <li key={index}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        ) : (
          <p>No weather data available.</p>
        )}
      </section>

      {/* --- Soil Data Section - Updated to handle the API structure --- */}
      <section className="info-section">
        <h3>Soil Data</h3>
        {/* Check if soil data exists and has layers */}
        {soilData && soilData.properties && soilData.properties.layers && soilData.properties.layers.length > 0 ? (
          <div>
            {/* Map through each soil layer object */}
            {soilData.properties.layers.map((layer, layerIndex) => {
              // Extract conversion factor and target units for this layer
              const dFactor = layer.unit_measure.d_factor;
              const targetUnits = layer.unit_measure.target_units;

              return (
                <div key={layerIndex} className="soil-layer-info">
                  {/* Display Layer Name and its Target Units */}
                  <h4>{layer.name} ({targetUnits})</h4>
                  {/* Map through each depth object within the layer */}
                  {layer.depths.map((depth, depthIndex) => (
                    <div key={depthIndex} className="soil-depth-info">
                      {/* Display the Depth Label */}
                      <h5>Depth: {depth.label}</h5>
                      <ul>
                        {/* Iterate through values (mean, Q0.5, etc.) for this depth */}
                        {Object.entries(depth.values).map(([valueName, rawValue], valueIndex) => {
                           // --- Conversion Step ---
                           // Raw value from API is in mapped_units. Divide by d_factor to get value in target_units.
                           // Add safety check for dFactor being zero or null and for value being a number
                           const convertedValue = (dFactor != null && dFactor !== 0 && typeof rawValue === 'number') ? rawValue / dFactor : rawValue;
                           // Format the converted value for display (adjust precision as needed)
                           // Use toFixed() for numbers, keep others as is
                           const formattedValue = typeof convertedValue === 'number' ? convertedValue.toFixed(3) : convertedValue; // Increased precision

                          return (
                            <li key={valueIndex}>
                              {/* Display the value name, the converted value, and the target units */}
                              <strong>{valueName}:</strong> {formattedValue} {targetUnits}
                            </li>
                          );
                        })}
                        {/* Display uncertainty if available. Note: Unit for uncertainty is not provided in JSON. */}
                         {/* Display raw uncertainty value */}
                         {depth.values.uncertainty !== undefined && (
                             <li key="uncertainty">
                                <strong>uncertainty:</strong> {depth.values.uncertainty} {/* Display raw uncertainty */}
                             </li>
                         )}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          // Message displayed if no soil data or incorrect structure
          <p>No soil data available.</p>
        )}
      </section>


      {/* --- Recommendations Section (remains similar) --- */}
      <section className="info-section">
        <h3>Recommendations</h3>
        {/* Check if recommendations exist and have items */}
        {recommendations && recommendations.recommendations && recommendations.recommendations.length > 0 ? (
             recommendations.recommendations.map((crop, index) => (
              <div key={index} className="crop-card">
                <h4>{crop.crop_name}</h4>
                {/* Use optional chaining for nested properties */}
                <p className="crop-info">{crop.crop_info}</p>
                <div className="crop-details">
                  <p><strong>Growing Season:</strong> {crop.growing_info?.growing_season || 'N/A'}</p>
                  <p><strong>Water Needs:</strong> {crop.growing_info?.water_needs || 'N/A'}</p>
                  <p><strong>Soil Preference:</strong> {crop.growing_info?.soil_preference || 'N/A'}</p>
                  <p><strong>Harvest Time:</strong> {crop.growing_info?.harvest_time || 'N/A'}</p>
                  <p><strong>Expected Yield:</strong> {(crop.expected_yield?.in_tons_per_acre || 'N/A')} tons/acre</p>
                </div>
              </div>
            ))
         ) : (
            // Message displayed if no recommendations
            <p>No crop recommendations available based on the input.</p>
         )}
      </section>

      {/* --- Download Button --- */}
      <div className="download-section">
        {/* The button is enabled regardless of data presence, but the PDF content depends on the data checks */}
        <button onClick={downloadPDF}>Download Report</button>
      </div>
    </div>
  );
}

export default ResultPage;