import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function KycSuccess() {
  const navigate = useNavigate();

  // Auto-redirect after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 8000);
    return () => clearTimeout(timer);
  }, [navigate]);
  const handleContinue = () => {

  navigate("/dashboard");

};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white">
      {/* === Background === */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020a18] via-[#041a3b] to-[#062b57]" />
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-tr from-blue-600/40 to-cyan-400/30 blur-[150px] rounded-full"
      />
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/25 to-blue-700/25 blur-[160px] rounded-full"
      />

      {/* === Success Animation === */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <CheckCircle className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.6)]" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl font-bold text-white mt-6"
        >
          KYC Verified Successfully!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-gray-300 mt-4 max-w-md text-center"
        >
          Congratulations! Your PAN verification and KYC process have been
          successfully completed. You’ll be redirected to your dashboard
          shortly.
        </motion.p>
      </motion.div>

      {/* === Floating Particles === */}
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute bg-cyan-400/30 rounded-full blur-[2px]"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
