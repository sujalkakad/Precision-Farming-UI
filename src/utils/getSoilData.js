export default async function getSoilData(lat, lon) {
    const soilApiUrl = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}`;
    const controller = new AbortController();
    let timeout = null;

    try {
        console.log("🌍 Requesting soil data from API...");

        // ⏳ Increase timeout to 30 seconds
        timeout = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(soilApiUrl, { signal: controller.signal });

        clearTimeout(timeout); // ✅ Stop timeout when response is received

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        console.log("✅ Soil API response received:", data);
        return data;
    } catch (error) {
        if (error.name === "AbortError") {
            console.warn("⏳ API request timed out. Retrying...");
            return await retrySoilData(lat, lon); // 🔄 Retry request
        } else {
            console.error("❌ Soil API error:", error);
            return { error: error.message }; // Return structured error object
        }
    } finally {
        if (timeout) clearTimeout(timeout); // Extra safety cleanup
    }
}

// 🔄 Retry function for failed API calls (up to 2 retries)
async function retrySoilData(lat, lon, retries = 2) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        console.log(`🔄 Retry attempt ${attempt}/${retries}...`);
        try {
            return await getSoilData(lat, lon);
        } catch (error) {
            console.error(`⚠️ Retry ${attempt} failed:`, error);
        }
    }
    return { error: "Failed after multiple attempts" };
}



export async function extractSoilData(soilData) {
    const defaultValues = {
        soil_ph: 6.5,
        soil_nitrogen: 3.0,
        soil_phosphorus: 20,
        soil_potassium: 150,
        soil_moisture: 30,
        soil_cec: 10
    };

    if (!soilData || soilData.error || !soilData?.properties?.layers) {
        console.warn("⚠️ Using default soil values due to API failure.");
        return defaultValues;
    }

    const extractedData = { ...defaultValues };

    soilData.properties.layers.forEach(layer => {
        const meanValue = layer?.depths?.[0]?.values?.mean ?? null;

        switch (layer.name) {
            case "phh2o":
                extractedData.soil_ph = meanValue ?? defaultValues.soil_ph;
                break;
            case "cec":
                extractedData.soil_cec = meanValue ?? defaultValues.soil_cec;
                break;
            case "nitrogen":
                extractedData.soil_nitrogen = meanValue ?? defaultValues.soil_nitrogen;
                break;
            case "soc":
                extractedData.soil_phosphorus = meanValue ?? defaultValues.soil_phosphorus;
                break;
            case "k":
                extractedData.soil_potassium = meanValue ?? defaultValues.soil_potassium;
                break;
            case "moisture":
                extractedData.soil_moisture = meanValue ?? defaultValues.soil_moisture;
                break;
            default:
                console.warn(`⚠️ Unhandled soil property: ${layer.name}`);
                break;
        }
    });

    return extractedData;
}
