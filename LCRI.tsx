import React, { useState } from 'react';
import { AlertCircle, Thermometer, Cloud, Truck, Battery, Navigation } from 'lucide-react';

// ============================================================================
// CONFIGURATION: Decouple all math parameters from UI logic
// ============================================================================
const LCRI_CONFIG = {
  WEIGHTS: {
    TEMP: 0.40,
    TRAFFIC: 0.25,
    WEATHER: 0.20,
    VEHICLE: 0.15
  },
  THRESHOLDS: {
    SAFE: 26,
    MONITOR: 51,
    INTERVENE: 76
  },
  TEMP_BANDS: {
    OPTIMAL_MIN: 2,
    OPTIMAL_MAX: 8,
    WARM_MAX: 10,
    HOT_MAX: 15
  }
};

export default function LCRICalculator() {
  const [shipmentID, setShipmentID] = useState('PH-2026-TX01');
  const [origin, setOrigin] = useState('Mumbai, IN');
  const [destination, setDestination] = useState('Delhi, IN');
  const [eta, setETA] = useState('18:30');
  
  const [currentTemp, setCurrentTemp] = useState(9.5);
  const [humidity, setHumidity] = useState(65);
  const [weatherSeverity, setWeatherSeverity] = useState(1);
  
  const [trafficCongestion, setTrafficCongestion] = useState(45);
  const [delayMinutes, setDelayMinutes] = useState(35);
  const [routeDeviation, setRouteDeviation] = useState(false);
  
  const [fridgeStatus, setFridgeStatus] = useState(95);
  const [batteryStatus, setBatteryStatus] = useState(88);
  const [engineStatus, setEngineStatus] = useState(100);

  // ============================================================================
  // RISK CALCULATIONS
  // ============================================================================
  
  const calculateTempRisk = () => {
    const { OPTIMAL_MIN, OPTIMAL_MAX, WARM_MAX, HOT_MAX } = LCRI_CONFIG.TEMP_BANDS;
    
    // Optimal range: no risk
    if (currentTemp >= OPTIMAL_MIN && currentTemp <= OPTIMAL_MAX) return 0;
    
    // Warm range
    if (currentTemp > OPTIMAL_MAX && currentTemp <= WARM_MAX) return 30;
    
    // Hot range
    if (currentTemp > WARM_MAX && currentTemp <= HOT_MAX) return 70;
    
    // Too hot
    if (currentTemp > HOT_MAX) return 100;
    
    // Below freezing: smoothly scale risk from 2°C down to -5°C
    if (currentTemp < OPTIMAL_MIN) {
      const freezeSeverity = OPTIMAL_MIN - currentTemp;
      return Math.min(50 + (freezeSeverity * 10), 100);
    }
    
    return 0;
  };

  const calculateTrafficRisk = () => {
    let risk = trafficCongestion * 0.6;
    if (delayMinutes > 60) risk += 20;
    if (delayMinutes > 120) risk += 15;
    if (routeDeviation) risk += 10;
    return Math.min(risk, 100);
  };

  const calculateWeatherRisk = () => {
    const baseRisk = weatherSeverity * 25;
    const humidityRisk = humidity > 80 ? 15 : humidity > 70 ? 8 : 0;
    return Math.min(baseRisk + humidityRisk, 100);
  };

  const calculateVehicleRisk = () => {
    let risk = 0;
    if (fridgeStatus < 85) risk += (85 - fridgeStatus) * 1.5;
    if (batteryStatus < 80) risk += (80 - batteryStatus) * 1.2;
    if (engineStatus < 95) risk += (95 - engineStatus);
    return Math.min(risk, 100);
  };

  const tempRisk = calculateTempRisk();
  const trafficRisk = calculateTrafficRisk();
  const weatherRisk = calculateWeatherRisk();
  const vehicleRisk = calculateVehicleRisk();

  // ============================================================================
  // COMPOSITE INDEX CALCULATION (uses LCRI_CONFIG)
  // ============================================================================
  const lcri = 
    (tempRisk * LCRI_CONFIG.WEIGHTS.TEMP) + 
    (trafficRisk * LCRI_CONFIG.WEIGHTS.TRAFFIC) + 
    (weatherRisk * LCRI_CONFIG.WEIGHTS.WEATHER) + 
    (vehicleRisk * LCRI_CONFIG.WEIGHTS.VEHICLE);

  // ============================================================================
  // DECISION ENGINE (uses LCRI_CONFIG thresholds)
  // ============================================================================
  const getDecision = () => {
    if (lcri < LCRI_CONFIG.THRESHOLDS.SAFE) 
      return { label: '🟢 Safe', action: 'Continue Transit', color: 'bg-green-50 border-green-300' };
    if (lcri < LCRI_CONFIG.THRESHOLDS.MONITOR) 
      return { label: '🟡 Monitor', action: 'Increase Monitoring', color: 'bg-yellow-50 border-yellow-300' };
    if (lcri < LCRI_CONFIG.THRESHOLDS.INTERVENE) 
      return { label: '🟠 Intervention Required', action: 'Consider Alternative Route', color: 'bg-orange-50 border-orange-300' };
    
    return { label: '🔴 Critical', action: 'Immediate Action Required', color: 'bg-red-50 border-red-300' };
  };

  const decision = getDecision();

  // ============================================================================
  // PRESETS
  // ============================================================================
  const presets = [
    {
      name: 'Optimal Conditions',
      temp: 5.0,
      humidity: 55,
      weather: 0,
      traffic: 15,
      delay: 5,
      fridge: 99,
      battery: 95,
      engine: 100
    },
    {
      name: 'Mild Challenge',
      temp: 11.2,
      humidity: 72,
      weather: 1,
      traffic: 55,
      delay: 45,
      fridge: 88,
      battery: 82,
      engine: 98
    },
    {
      name: 'Critical Risk',
      temp: 16.8,
      humidity: 88,
      weather: 3,
      traffic: 85,
      delay: 120,
      fridge: 72,
      battery: 65,
      engine: 85
    }
  ];

  const loadPreset = (preset) => {
    setCurrentTemp(preset.temp);
    setHumidity(preset.humidity);
    setWeatherSeverity(preset.weather);
    setTrafficCongestion(preset.traffic);
    setDelayMinutes(preset.delay);
    setFridgeStatus(preset.fridge);
    setBatteryStatus(preset.battery);
    setEngineStatus(preset.engine);
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">LCRI: Logistics Cold-Chain Risk Index</h1>
          <p className="text-gray-600">Real-time pharmaceutical shipment risk assessment</p>
        </div>

        {/* Preset Buttons */}
        <div className="mb-6 flex gap-3 flex-wrap">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: INPUTS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipment Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipment Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipment ID</label>
                  <input
                    type="text"
                    value={shipmentID}
                    onChange={(e) => setShipmentID(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ETA</label>
                  <input
                    type="time"
                    value={eta}
                    onChange={(e) => setETA(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Environmental Data */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Thermometer size={20} /> Environmental Data
              </h2>
              <div className="space-y-4">
                {/* Temperature with Numeric Input */}
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Temperature</span>
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        step="0.1"
                        value={currentTemp}
                        onChange={(e) => setCurrentTemp(parseFloat(e.target.value) || 0)}
                        className="w-16 px-1 py-0.5 text-right font-bold text-blue-600 border border-gray-300 rounded text-sm bg-gray-50"
                      />
                      <span className="text-sm font-bold text-gray-600">°C</span>
                    </div>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={currentTemp}
                    onChange={(e) => setCurrentTemp(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-500 mt-1">Target: 2-8°C (Green), Risk increases beyond</div>
                </div>

                {/* Humidity */}
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Humidity</span>
                    <span className="text-lg font-bold text-blue-600">{humidity}%</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="95"
                    value={humidity}
                    onChange={(e) => setHumidity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Weather Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weather Severity</label>
                  <div className="flex gap-2">
                    {['Clear', 'Mild', 'Moderate', 'Severe'].map((w, i) => (
                      <button
                        key={i}
                        onClick={() => setWeatherSeverity(i)}
                        className={`flex-1 py-2 rounded text-sm font-medium transition ${
                          weatherSeverity === i
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Transit Data */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Navigation size={20} /> Transit Data
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Traffic Congestion</span>
                    <span className="text-lg font-bold text-orange-600">{trafficCongestion}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={trafficCongestion}
                    onChange={(e) => setTrafficCongestion(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Estimated Delay</span>
                    <span className="text-lg font-bold text-orange-600">{delayMinutes} min</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={delayMinutes}
                    onChange={(e) => setDelayMinutes(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="deviation"
                    checked={routeDeviation}
                    onChange={(e) => setRouteDeviation(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="deviation" className="text-sm font-medium text-gray-700">
                    Route Deviation Required
                  </label>
                </div>
              </div>
            </div>

            {/* Vehicle Health */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Truck size={20} /> Vehicle Health
              </h2>
              <div className="space-y-4">
                {/* Refrigeration Unit Slider */}
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Refrigeration Unit</span>
                    <span className={`text-lg font-bold ${fridgeStatus > 85 ? 'text-green-600' : 'text-orange-600'}`}>
                      {fridgeStatus}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fridgeStatus}
                    onChange={(e) => setFridgeStatus(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Battery Status Slider */}
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Battery Status</span>
                    <span className={`text-lg font-bold ${batteryStatus > 80 ? 'text-green-600' : 'text-orange-600'}`}>
                      {batteryStatus}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={batteryStatus}
                    onChange={(e) => setBatteryStatus(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Engine Status Slider */}
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Engine Status</span>
                    <span className={`text-lg font-bold ${engineStatus > 95 ? 'text-green-600' : 'text-orange-600'}`}>
                      {engineStatus}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={engineStatus}
                    onChange={(e) => setEngineStatus(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: OUTPUTS */}
          <div className="space-y-6">
            {/* Risk Factors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Factors</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-medium text-gray-700">Temperature</span>
                  <span className="text-2xl font-bold text-blue-600">{tempRisk.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="font-medium text-gray-700">Traffic</span>
                  <span className="text-2xl font-bold text-orange-600">{trafficRisk.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="font-medium text-gray-700">Weather</span>
                  <span className="text-2xl font-bold text-purple-600">{weatherRisk.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="font-medium text-gray-700">Vehicle</span>
                  <span className="text-2xl font-bold text-red-600">{vehicleRisk.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* LCRI Score */}
            <div className={`rounded-lg shadow-md p-6 ${decision.color} border-2`}>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Composite Index</h2>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-gray-900 mb-2">{lcri.toFixed(1)}</div>
                <div className="text-sm text-gray-600">LCRI Score (0-100)</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition ${
                    lcri < 26 ? 'bg-green-500' :
                    lcri < 51 ? 'bg-yellow-500' :
                    lcri < 76 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(lcri, 100)}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <strong>0-25:</strong> Safe | <strong>26-50:</strong> Monitor | <strong>51-75:</strong> Intervene | <strong>76-100:</strong> Critical
              </div>
            </div>

            {/* Decision */}
            <div className={`rounded-lg shadow-md p-6 ${decision.color} border-2`}>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Decision Support</h2>
              <div className="text-3xl font-bold text-gray-900 mb-3">{decision.label}</div>
              <div className="bg-white bg-opacity-70 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-800 mb-2">Recommended Action:</p>
                <p className="text-gray-700">{decision.action}</p>
              </div>
            </div>

            {/* Formula Reference */}
            <div className="bg-gray-50 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">LCRI Formula</h3>
              <div className="text-xs font-mono text-gray-700 space-y-2">
                <div>LCRI = (TempR × {LCRI_CONFIG.WEIGHTS.TEMP}) + (TrafficR × {LCRI_CONFIG.WEIGHTS.TRAFFIC}) + (WeatherR × {LCRI_CONFIG.WEIGHTS.WEATHER}) + (VehicleR × {LCRI_CONFIG.WEIGHTS.VEHICLE})</div>
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <div>TempR = {tempRisk.toFixed(1)}</div>
                  <div>TrafficR = {trafficRisk.toFixed(1)}</div>
                  <div>WeatherR = {weatherRisk.toFixed(1)}</div>
                  <div>VehicleR = {vehicleRisk.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}