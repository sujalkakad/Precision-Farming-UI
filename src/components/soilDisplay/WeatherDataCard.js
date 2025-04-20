import React from 'react';
import { Cloud, Sun, Wind, Droplet, Thermometer } from 'lucide-react';

const WeatherDataCard = () => {
  // Sample weather data - replace with your actual data
  const weatherData = {
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    rainfall: 0.2,
    forecast: "Partly Cloudy",
    uvIndex: 5
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#2F855A]">Weather Conditions</h2>
        <div className="flex space-x-2">
          <Sun className="text-yellow-500 h-5 w-5" />
          <Cloud className="text-gray-400 h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#F0F9FF] rounded-md border border-[#BEE3F8] transition-all duration-300 hover:bg-[#EBF8FF] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Thermometer className="h-4 w-4 text-[#ED8936] mr-2" />
            <p className="text-sm text-gray-600 font-medium">Temperature</p>
          </div>
          <p className="text-2xl font-semibold text-[#2B6CB0]">{weatherData.temperature}°C</p>
        </div>
        
        <div className="p-4 bg-[#F0F9FF] rounded-md border border-[#BEE3F8] transition-all duration-300 hover:bg-[#EBF8FF] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Droplet className="h-4 w-4 text-[#3182CE] mr-2" />
            <p className="text-sm text-gray-600 font-medium">Humidity</p>
          </div>
          <p className="text-2xl font-semibold text-[#2B6CB0]">{weatherData.humidity}%</p>
        </div>
        
        <div className="p-4 bg-[#F0F9FF] rounded-md border border-[#BEE3F8] transition-all duration-300 hover:bg-[#EBF8FF] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Wind className="h-4 w-4 text-[#718096] mr-2" />
            <p className="text-sm text-gray-600 font-medium">Wind Speed</p>
          </div>
          <p className="text-2xl font-semibold text-[#2B6CB0]">{weatherData.windSpeed} km/h</p>
        </div>
        
        <div className="p-4 bg-[#F0F9FF] rounded-md border border-[#BEE3F8] transition-all duration-300 hover:bg-[#EBF8FF] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Droplet className="h-4 w-4 text-[#3182CE] mr-2" />
            <p className="text-sm text-gray-600 font-medium">Rainfall</p>
          </div>
          <p className="text-2xl font-semibold text-[#2B6CB0]">{weatherData.rainfall} mm</p>
        </div>
        
        <div className="p-4 bg-[#F0F9FF] rounded-md border border-[#BEE3F8] transition-all duration-300 hover:bg-[#EBF8FF] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Cloud className="h-4 w-4 text-[#718096] mr-2" />
            <p className="text-sm text-gray-600 font-medium">Forecast</p>
          </div>
          <p className="text-2xl font-semibold text-[#2B6CB0]">{weatherData.forecast}</p>
        </div>
        
        <div className="p-4 bg-[#F0F9FF] rounded-md border border-[#BEE3F8] transition-all duration-300 hover:bg-[#EBF8FF] hover:shadow-sm">
          <div className="flex items-center mb-2">
            <Sun className="h-4 w-4 text-[#DD6B20] mr-2" />
            <p className="text-sm text-gray-600 font-medium">UV Index</p>
          </div>
          <p className="text-2xl font-semibold text-[#2B6CB0]">{weatherData.uvIndex}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDataCard;
