import { useState } from "react";
import { SlGraph } from "react-icons/sl";
import { Activity } from "lucide-react";
import { PiPlantFill } from "react-icons/pi";
import PlantMonitoring from "./PlantMonitoring";
import GreenhouseAnalytics from "./GreenhouseAnalytics";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [pageState, setPageState] = useState("livepage");

  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="bg-slate-900 border-b border-slate-700 p-4 text-white h-[70px] w-full">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Activity className="mr-2 text-green-400" />
            AI-One: Greenhouse Management System
          </h1>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 border-[1px] border-gray-600 focus:ring-2 focus:ring-green-500"
              onClick={() => setPageState("livepage")}
            >
              <PiPlantFill className="text-green-400" />
              <span>Live Page</span>
            </button>
          </div>
        </div>
      </header>

      {/* Animated Transition for Page Change */}
      <div className="relative flex-grow">
        <AnimatePresence mode="wait">
          {pageState === "livepage" && (
            <motion.div
              key="livepage"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="absolute w-full"
            >
              <PlantMonitoring />
            </motion.div>
          )}
          {pageState === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="absolute w-full"
            >
              <GreenhouseAnalytics />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;
