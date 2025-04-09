import React, { createContext, useState } from "react";

const SoilContext = createContext();

export const SoilProvider = ({ children }) => {
    const [soilData, setSoilData] = useState(null);

    return (
        <SoilContext.Provider value={{ soilData, setSoilData }}>
            {children}
        </SoilContext.Provider>
    );
};

export default SoilContext;
