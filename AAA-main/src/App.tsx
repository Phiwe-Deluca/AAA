import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Badges from "./pages/Badges";
import TravelEngine from "./pages/TravelEngine";
import FrequentedAreas from "./pages/FrequentedAreas";
import Settings from "./pages/Settings";

import { getWeatherByCoords } from "./hooks/services/weatherService";
import { getCrimeNewsByCoords } from "./hooks/services/crimeService";

const queryClient = new QueryClient();

const App = () => {
useEffect(() => {
  const lat = -25.8601; // Centurion
  const lon = 28.1890;  // Centurion

  async function fetchAndNotify() {
    console.log("🔄 Fetching alerts at", new Date().toLocaleTimeString());

    const weather = await getWeatherByCoords(lat, lon);
    if (!weather.error && weather.weather) {
      toast.info(`🌦 Weather: ${weather.weather.main} (${Date.now()})`, {
        description: `${weather.weather.description}, Temp: ${weather.weather.temperature}°C`
      });
    }

    const crime = await getCrimeNewsByCoords(lat, lon);
    if (!crime.error && crime.incidents?.length > 0) {
      crime.incidents.slice(0, 3).forEach((incident) => {
        toast.error(`🚨 Crime: ${incident.headline} (${Date.now()})`, {
          description: incident.tags.join(", ")
        });
      });
    }
  }

  // First notification after 5 seconds
  const firstTimeout = setTimeout(fetchAndNotify, 5000);

  // Repeat every 15 seconds (for testing)
  const intervalId = setInterval(fetchAndNotify, 15000);

  return () => {
    clearTimeout(firstTimeout);
    clearInterval(intervalId);
  };
}, []);


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/travel-engine" element={<TravelEngine />} />
            <Route path="/frequented-areas" element={<FrequentedAreas />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
