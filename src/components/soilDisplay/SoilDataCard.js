import React from 'react';
import { Droplet, Thermometer, Leaf } from 'lucide-react';

const SoilDataCard = () => {
  // Sample data - replace with your actual data
  const soilData = {
    ph: 6.8,
    moisture: 35,
    nitrogen: 14,
    carbon: 2.5,
    cec: 15,
    potassium: 180
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#2F855A]">Soil Analysis</h2>
        <div className="flex space-x-2">
          <Leaf className="text-[#4C9F70] h-5 w-5" />
          <Thermometer className="text-[#8B5E3C] h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#F0FFF4] rounded-md border border-[#C6F6D5] transition-all duration-300 hover:bg-[#E6FFFA] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Thermometer className="h-4 w-4 text-[#38A169] mr-2" />
            <p className="text-sm text-gray-600 font-medium">pH Level</p>
          </div>
          <p className="text-2xl font-semibold text-[#276749]">{soilData.ph}</p>
        </div>
        
        <div className="p-4 bg-[#F0FFF4] rounded-md border border-[#C6F6D5] transition-all duration-300 hover:bg-[#E6FFFA] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Droplet className="h-4 w-4 text-[#3182CE] mr-2" />
            <p className="text-sm text-gray-600 font-medium">Moisture</p>
          </div>
          <p className="text-2xl font-semibold text-[#276749]">{soilData.moisture}%</p>
        </div>
        
        <div className="p-4 bg-[#F0FFF4] rounded-md border border-[#C6F6D5] transition-all duration-300 hover:bg-[#E6FFFA] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Leaf className="h-4 w-4 text-[#4C9F70] mr-2" />
            <p className="text-sm text-gray-600 font-medium">Nitrogen</p>
          </div>
          <p className="text-2xl font-semibold text-[#276749]">{soilData.nitrogen} mg/kg</p>
        </div>
        
        <div className="p-4 bg-[#F0FFF4] rounded-md border border-[#C6F6D5] transition-all duration-300 hover:bg-[#E6FFFA] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Leaf className="h-4 w-4 text-[#4C9F70] mr-2" />
            <p className="text-sm text-gray-600 font-medium">Carbon</p>
          </div>
          <p className="text-2xl font-semibold text-[#276749]">{soilData.carbon}%</p>
        </div>
        
        <div className="p-4 bg-[#F0FFF4] rounded-md border border-[#C6F6D5] transition-all duration-300 hover:bg-[#E6FFFA] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Thermometer className="h-4 w-4 text-[#DD6B20] mr-2" />
            <p className="text-sm text-gray-600 font-medium">CEC</p>
          </div>
          <p className="text-2xl font-semibold text-[#276749]">{soilData.cec} meq/100g</p>
        </div>
        
        <div className="p-4 bg-[#F0FFF4] rounded-md border border-[#C6F6D5] transition-all duration-300 hover:bg-[#E6FFFA] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Leaf className="h-4 w-4 text-[#4C9F70] mr-2" />
            <p className="text-sm text-gray-600 font-medium">Potassium</p>
          </div>
          <p className="text-2xl font-semibold text-[#276749]">{soilData.potassium} ppm</p>
        </div>
      </div>
    </div>
  );
};

export default SoilDataCard;
