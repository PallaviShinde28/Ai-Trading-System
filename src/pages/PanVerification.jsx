import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, XCircle, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PanVerification() {
  const [pan, setPan] = useState("");
  const [status, setStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDigiLocker, setShowDigiLocker] = useState(false);
  const [digiStatus, setDigiStatus] = useState("idle");
  const navigate = useNavigate();

  const isValidPAN = (input) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(input);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!isValidPAN(pan)) {
      alert("⚠️ Invalid PAN format. Example: ABCDE1234F");
      return;
    }

    setIsVerifying(true);
    setStatus(null);

    setTimeout(() => {
      setIsVerifying(false);
      setStatus("success");
      setTimeout(() => navigate("/kyc-process"), 2000); // ✅ Go to KYC process
    }, 2500);
  };

  const handleFetchViaDigiLocker = () => {
    setShowDigiLocker(true);
    setDigiStatus("connecting");

    setTimeout(() => setDigiStatus("fetching"), 2000);
    setTimeout(() => {
      setDigiStatus("done");
      setPan("ABCDE1234F");
      setTimeout(() => {
        setShowDigiLocker(false);
        setStatus("success");
        setTimeout(() => navigate("/kyc-process"), 2000); // ✅ Go to KYC process
      }, 2000);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#020a18] via-[#041a3b] to-[#062b57]" />

      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-tr from-blue-600/40 to-cyan-400/30 blur-[150px] rounded-full"
      />

      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/25 to-blue-700/25 blur-[160px] rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-[90%] max-w-md p-10 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-center"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 mb-4">
            <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-white">
            Verify Your Identity
          </h2>
          <p className="text-gray-300 text-sm mb-6">
            Enter your PAN or fetch details securely via DigiLocker.
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            maxLength="10"
            placeholder="Enter your PAN (ABCDE1234F)"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            className="w-full text-center p-3 text-lg rounded-md bg-transparent border-b-2 border-cyan-400 focus:outline-none text-cyan-300 tracking-widest mb-8"
          />
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-700 text-white rounded-lg font-semibold"
            >
              {isVerifying ? "Verifying..." : "Verify PAN"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleFetchViaDigiLocker}
              className="w-full py-3 bg-transparent border border-cyan-400 text-cyan-300 rounded-lg"
            >
              Fetch via DigiLocker
            </motion.button>
          </div>
        </form>

        <AnimatePresence>
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-xl"
            >
              <CheckCircle className="w-16 h-16 text-blue-500 mb-2 animate-bounce" />
              <p className="text-blue-600 font-semibold text-lg">
                PAN Verified Successfully!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DigiLocker Modal */}
        <AnimatePresence>
          {showDigiLocker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-10 w-[90%] max-w-md text-center text-white backdrop-blur-lg"
              >
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                  DigiLocker
                </h2>
                {digiStatus === "connecting" && (
                  <>
                    <Loader2 className="animate-spin mx-auto w-12 h-12 text-cyan-400 mb-4" />
                    <p>Connecting to DigiLocker...</p>
                  </>
                )}
                {digiStatus === "fetching" && (
                  <>
                    <Loader2 className="animate-spin mx-auto w-12 h-12 text-blue-400 mb-4" />
                    <p>Fetching your documents...</p>
                  </>
                )}
                {digiStatus === "done" && (
                  <>
                    <CheckCircle className="mx-auto w-16 h-16 text-green-400 mb-4 animate-bounce" />
                    <p>PAN Fetched Successfully!</p>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
