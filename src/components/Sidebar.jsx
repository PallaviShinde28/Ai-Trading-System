import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, Home, User, Cpu, LogOut } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-gray-100 w-64 min-h-screen p-6 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <h2
          className="text-2xl font-bold text-cyan-400 cursor-pointer mb-8"
          onClick={() => navigate("/dashboard")}
        >
          Invsto
        </h2>

        <nav className="space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 hover:text-cyan-400 w-full text-left"
          >
            <Home size={18} /> Dashboard
          </button>

          <button
            onClick={() => navigate("/overview")}
            className="flex items-center gap-2 hover:text-cyan-400 w-full text-left"
          >
            <BarChart2 size={18} /> Overview
          </button>

          <button
            onClick={() => navigate("/portfolio")}
            className="flex items-center gap-2 hover:text-cyan-400 w-full text-left"
          >
            <User size={18} /> Portfolio
          </button>

          <button
            onClick={() => navigate("/ai-predictions")}
            className="flex items-center gap-2 hover:text-cyan-400 w-full text-left"
          >
            <Cpu size={18} /> AI Predictions
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-red-400 hover:text-red-500 w-full text-left"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
