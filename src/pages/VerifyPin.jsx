
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyPin() {

  const navigate = useNavigate();
  const location = useLocation();

  const queryEmail =
    new URLSearchParams(location.search).get("email");

  const email =
    queryEmail || localStorage.getItem("email");

  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // ================= INPUT =================
  const handleChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  // ================= VERIFY PIN =================
  const handleVerifyPin = async (e) => {

    e.preventDefault();

    const enteredPin = pin.join("");

    if (enteredPin.length !== 4) {
      alert("Please enter your 4-digit PIN.");
      return;
    }

    if (!email) {
      alert("Session expired. Please login again.");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:5000/api/auth/verify-pin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            pin: enteredPin
          })
        }
      );

     const data = await res.json();
    
      console.log("VERIFY PIN RESPONSE:", data);

      if (!res.ok || !data.success) {
        alert(data.message || "Wrong PIN");
        setLoading(false);
        return;
      }

      // ✅ STORE TOKEN (OPTIONAL)
      localStorage.setItem("token", data.token);

      // 🔥 FINAL STEP
      navigate("/dashboard");

    } catch (err) {

      console.error("VERIFY PIN ERROR:", err);
      alert("Server error. Try again.");

    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020a18] via-[#041a3b] to-[#062b57]"></div>

      {/* Glow Effects */}
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-tr from-blue-600/40 to-cyan-400/30 blur-[150px] rounded-full"
      />

      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 12 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/25 to-blue-700/25 blur-[160px] rounded-full"
      />

      {/* Header */}
      <div className="flex items-center mb-8 z-10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 mr-2"></div>
        <h1 className="text-2xl font-semibold">Invsto</h1>
      </div>

      {/* Card */}
      <div className="relative z-10 w-[90%] max-w-md p-10 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-center">

        {/* Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 mb-4">
            <Lock className="text-white w-7 h-7" />
          </div>

          <h2 className="text-lg font-semibold mb-2">
            Enter Your Security PIN
          </h2>

          <p className="text-gray-300 text-sm mb-6">
            Enter your 4-digit PIN to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleVerifyPin}>

          <div className="flex justify-center space-x-6 mb-8">
            {pin.map((digit, i) => (
              <input
                key={i}
                id={`pin-${i}`}
                type="password"
                maxLength="1"
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, i)
                }
                className="w-12 h-12 text-center text-2xl text-cyan-400 border-b-2 border-cyan-400 bg-transparent"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-700 rounded-lg"
          >
            {loading ? "Verifying..." : "VERIFY PIN"}
          </button>

        </form>

        {/* Logout */}
        <div className="mt-8 text-sm text-gray-300">
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:underline"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}


