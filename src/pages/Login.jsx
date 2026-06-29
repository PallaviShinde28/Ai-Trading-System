
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import spaceBg from "../assets/space-bg.jpeg";

export default function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {

    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {

      setLoading(true);

      console.log("🔥 Calling API...");

      const res = await axios.post(
        "http://localhost:5000/api/auth/request-otp",
        { email: email.toLowerCase().trim() }
      );

      console.log("✅ RESPONSE:", res.data);

      if (res.data.success) {

        if (remember) {
          localStorage.setItem("email", email);
        } else {
          sessionStorage.setItem("email", email);
        }

        navigate(`/verify-otp?email=${email}`);
      }

    } catch (err) {
      console.log("❌ LOGIN ERROR:", err);
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${spaceBg})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative w-[420px] p-10 rounded-3xl
                      bg-gradient-to-b from-[#22394f] to-[#141f2c]
                      border border-white/20
                      shadow-[0_0_80px_rgba(0,0,0,0.8)]
                      backdrop-blur-xl">

        <h2 className="text-3xl font-semibold text-center text-white mb-8">
          LOGIN
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full mb-6 px-5 py-4 rounded-xl bg-gray-200 text-black outline-none"
        />

        <div className="flex items-center gap-2 mb-6 text-white">
          <input
            type="checkbox"
            checked={remember}
            onChange={()=>setRemember(!remember)}
          />
          Remember Me
        </div>

        {error && (
          <p className="text-red-400 text-center mb-6">
            {error}
          </p>
        )}

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full py-4 rounded-xl
                     bg-gradient-to-r from-cyan-500 to-blue-600
                     text-white font-semibold"
        >
          {loading ? "Sending OTP..." : "Continue"}
        </button>

      </div>
    </div>
  );
}