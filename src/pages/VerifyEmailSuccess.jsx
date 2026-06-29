import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function VerifyEmailSuccess() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const goNext = () => {
    navigate("/dashboard"); // change if needed
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020a18] to-[#1a2a5a]">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-[#0a1628] p-10 rounded-2xl shadow-2xl text-center w-[420px]"
      >

        {/* Success Icon */}
        <div className="text-green-400 text-6xl mb-4">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-green-400 mb-2">
          Email Verified Successfully
        </h2>

        {/* Email */}
        <p className="text-gray-400 mb-6">
          Your account is now secured and ready to use.
        </p>

        {email && (
          <div className="bg-[#020a18] p-3 rounded mb-6 text-cyan-400">
            {email}
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={goNext}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Continue to Dashboard
        </button>

        {/* Optional next step */}
        <button
          onClick={() => navigate("/kyc-process")}
          className="w-full mt-3 text-gray-400 hover:text-white"
        >
          Complete KYC →
        </button>

      </motion.div>

    </div>

  );
}
