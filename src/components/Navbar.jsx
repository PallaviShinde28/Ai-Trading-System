import React from "react";
import { useAIMode } from "../context/AIModeContext.jsx";

const Navbar = () => {
  const { aiActive, toggleAI } = useAIMode();

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-indigo-400">AI Trading Dashboard</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleAI}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            aiActive
              ? "bg-green-600 hover:bg-green-500"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {aiActive ? "🧠 AI Active" : "⚙️ AI Off"}
        </button>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-indigo-500"
        />
      </div>
    </nav>
  );
};

export default Navbar;
