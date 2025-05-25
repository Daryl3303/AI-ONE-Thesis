import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';



const GreenhouseAnalytics = () => {
  // Sample dates for the date dropdown
  const availableDates = [
    "2025-03-22",
    "2025-03-21", 
    "2025-03-20", 
    "2025-03-19", 
    "2025-03-18"
  ];

  // Sample hourly data for NPK levels
  const hourlyNitrogenData = [
    { hour: "00:00", nitrogen: 42 }, { hour: "01:00", nitrogen: 41 }, { hour: "02:00", nitrogen: 40 },
    { hour: "03:00", nitrogen: 39 }, { hour: "04:00", nitrogen: 38 }, { hour: "05:00", nitrogen: 40 },
    { hour: "06:00", nitrogen: 43 }, { hour: "07:00", nitrogen: 45 }, { hour: "08:00", nitrogen: 48 },
    { hour: "09:00", nitrogen: 52 }, { hour: "10:00", nitrogen: 55 }, { hour: "11:00", nitrogen: 56 },
    { hour: "12:00", nitrogen: 54 }, { hour: "13:00", nitrogen: 53 }, { hour: "14:00", nitrogen: 52 },
    { hour: "15:00", nitrogen: 50 }, { hour: "16:00", nitrogen: 49 }, { hour: "17:00", nitrogen: 47 },
    { hour: "18:00", nitrogen: 46 }, { hour: "19:00", nitrogen: 45 }, { hour: "20:00", nitrogen: 44 },
    { hour: "21:00", nitrogen: 43 }, { hour: "22:00", nitrogen: 42 }, { hour: "23:00", nitrogen: 41 }
  ];

  const hourlyPhosphorusData = [
    { hour: "00:00", phosphorus: 28 }, { hour: "01:00", phosphorus: 27 }, { hour: "02:00", phosphorus: 27 },
    { hour: "03:00", phosphorus: 26 }, { hour: "04:00", phosphorus: 26 }, { hour: "05:00", phosphorus: 27 },
    { hour: "06:00", phosphorus: 28 }, { hour: "07:00", phosphorus: 30 }, { hour: "08:00", phosphorus: 31 },
    { hour: "09:00", phosphorus: 33 }, { hour: "10:00", phosphorus: 35 }, { hour: "11:00", phosphorus: 36 },
    { hour: "12:00", phosphorus: 36 }, { hour: "13:00", phosphorus: 35 }, { hour: "14:00", phosphorus: 34 },
    { hour: "15:00", phosphorus: 33 }, { hour: "16:00", phosphorus: 32 }, { hour: "17:00", phosphorus: 31 },
    { hour: "18:00", phosphorus: 30 }, { hour: "19:00", phosphorus: 29 }, { hour: "20:00", phosphorus: 28 },
    { hour: "21:00", phosphorus: 28 }, { hour: "22:00", phosphorus: 28 }, { hour: "23:00", phosphorus: 27 }
  ];

  const hourlyPotassiumData = [
    { hour: "00:00", potassium: 36 }, { hour: "01:00", potassium: 35 }, { hour: "02:00", potassium: 35 },
    { hour: "03:00", potassium: 34 }, { hour: "04:00", potassium: 34 }, { hour: "05:00", potassium: 35 },
    { hour: "06:00", potassium: 37 }, { hour: "07:00", potassium: 39 }, { hour: "08:00", potassium: 41 },
    { hour: "09:00", potassium: 43 }, { hour: "10:00", potassium: 45 }, { hour: "11:00", potassium: 46 },
    { hour: "12:00", potassium: 45 }, { hour: "13:00", potassium: 44 }, { hour: "14:00", potassium: 43 },
    { hour: "15:00", potassium: 42 }, { hour: "16:00", potassium: 41 }, { hour: "17:00", potassium: 40 },
    { hour: "18:00", potassium: 39 }, { hour: "19:00", potassium: 38 }, { hour: "20:00", potassium: 37 },
    { hour: "21:00", potassium: 37 }, { hour: "22:00", potassium: 36 }, { hour: "23:00", potassium: 36 }
  ];

  const hourlySoilMoistureData = [
    { hour: "00:00", moisture: 58 }, { hour: "01:00", moisture: 57 }, { hour: "02:00", moisture: 57 },
    { hour: "03:00", moisture: 56 }, { hour: "04:00", moisture: 56 }, { hour: "05:00", moisture: 55 },
    { hour: "06:00", moisture: 55 }, { hour: "07:00", moisture: 54 }, { hour: "08:00", moisture: 53 },
    { hour: "09:00", moisture: 52 }, { hour: "10:00", moisture: 51 }, { hour: "11:00", moisture: 50 },
    { hour: "12:00", moisture: 49 }, { hour: "13:00", moisture: 48 }, { hour: "14:00", moisture: 49 },
    { hour: "15:00", moisture: 50 }, { hour: "16:00", moisture: 51 }, { hour: "17:00", moisture: 52 },
    { hour: "18:00", moisture: 53 }, { hour: "19:00", moisture: 54 }, { hour: "20:00", moisture: 55 },
    { hour: "21:00", moisture: 56 }, { hour: "22:00", moisture: 57 }, { hour: "23:00", moisture: 58 }
  ];

  // Calculate averages
  const calculateAverage = (data: any, key: any) => {
    const sum = data.reduce((acc: any, item: any) => acc + item[key], 0);
    return sum / data.length;
  };

  const nitrogenAvg = calculateAverage(hourlyNitrogenData, "nitrogen");
  const phosphorusAvg = calculateAverage(hourlyPhosphorusData, "phosphorus");
  const potassiumAvg = calculateAverage(hourlyPotassiumData, "potassium");
  const moistureAvg = calculateAverage(hourlySoilMoistureData, "moisture");

  // Active plant and date state
  const [activePlant, setActivePlant] = useState('Tomato');
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      
      

      {/* Main content */}
      <main className="p-6">
        {/* Plant and date selection */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold">NPK Analytics Dashboard</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="date-select" className="text-gray-400">Date:</label>
              <select 
                id="date-select"
                className="bg-gray-700 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {availableDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="plant-select" className="text-gray-400">Active Plant:</label>
              <select 
                id="plant-select"
                className="bg-gray-700 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={activePlant}
                onChange={(e) => setActivePlant(e.target.value)}
              >
                <option>Tomato</option>
                <option>Lettuce</option>
                <option>Cucumber</option>
                <option>Pepper</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chart grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nitrogen Chart */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-green-400">Nitrogen (ppm)</h3>
              <div className="text-sm bg-gray-700 px-3 py-1 rounded">
                Average: <span className="font-bold">{nitrogenAvg.toFixed(1)}</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyNitrogenData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[30, 60]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }} />
                  <Line type="monotone" dataKey="nitrogen" stroke="#4ADE80" strokeWidth={2} activeDot={{ r: 8 }} />
                  <ReferenceLine y={nitrogenAvg} stroke="#4ADE80" strokeDasharray="3 3" label={{ value: 'Avg', position: 'insideTopRight', fill: '#4ADE80' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Phosphorus Chart */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-blue-400">Phosphorus (ppm)</h3>
              <div className="text-sm bg-gray-700 px-3 py-1 rounded">
                Average: <span className="font-bold">{phosphorusAvg.toFixed(1)}</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyPhosphorusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[20, 40]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }} />
                  <Line type="monotone" dataKey="phosphorus" stroke="#60A5FA" strokeWidth={2} activeDot={{ r: 8 }} />
                  <ReferenceLine y={phosphorusAvg} stroke="#60A5FA" strokeDasharray="3 3" label={{ value: 'Avg', position: 'insideTopRight', fill: '#60A5FA' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Potassium Chart */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-purple-400">Potassium (ppm)</h3>
              <div className="text-sm bg-gray-700 px-3 py-1 rounded">
                Average: <span className="font-bold">{potassiumAvg.toFixed(1)}</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyPotassiumData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[30, 50]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }} />
                  <Line type="monotone" dataKey="potassium" stroke="#A78BFA" strokeWidth={2} activeDot={{ r: 8 }} />
                  <ReferenceLine y={potassiumAvg} stroke="#A78BFA" strokeDasharray="3 3" label={{ value: 'Avg', position: 'insideTopRight', fill: '#A78BFA' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Soil Moisture Chart */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-amber-400">Soil Moisture (%)</h3>
              <div className="text-sm bg-gray-700 px-3 py-1 rounded">
                Average: <span className="font-bold">{moistureAvg.toFixed(1)}</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlySoilMoistureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[45, 60]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }} />
                  <Line type="monotone" dataKey="moisture" stroke="#F59E0B" strokeWidth={2} activeDot={{ r: 8 }} />
                  <ReferenceLine y={moistureAvg} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Avg', position: 'insideTopRight', fill: '#F59E0B' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* NPK Summary */}
        <div className="mt-6 bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-medium mb-4">Nutrient Summary: {activePlant}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-md p-4 flex flex-col items-center">
              <span className="text-green-400 text-sm">Nitrogen Status</span>
              <span className="text-2xl font-bold">Optimal</span>
              <span className="text-gray-400 text-sm">within range</span>
            </div>
            <div className="bg-gray-700 rounded-md p-4 flex flex-col items-center">
              <span className="text-blue-400 text-sm">Phosphorus Status</span>
              <span className="text-2xl font-bold">Low</span>
              <span className="text-gray-400 text-sm">supplement needed</span>
            </div>
            <div className="bg-gray-700 rounded-md p-4 flex flex-col items-center">
              <span className="text-purple-400 text-sm">Potassium Status</span>
              <span className="text-2xl font-bold">Optimal</span>
              <span className="text-gray-400 text-sm">within range</span>
            </div>
            <div className="bg-gray-700 rounded-md p-4 flex flex-col items-center">
              <span className="text-amber-400 text-sm">Overall NPK Score</span>
              <span className="text-2xl font-bold">86/100</span>
              <span className="text-gray-400 text-sm">good condition</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 px-6 py-4 text-center text-gray-400 text-sm">
        AI-One: Greenhouse Management System © 2025 | Thesis Project
      </footer>
    </div>
  );
};

export default GreenhouseAnalytics;