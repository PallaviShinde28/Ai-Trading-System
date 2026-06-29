import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import tradingBg from "../assets/trading-bg.jpeg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import axios from "axios";

export default function SignupPage() {

  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= SIGNUP =================
  const handleSignup = async () => {

    setError("");
    setSuccess("");

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    // 🔍 VALIDATIONS
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (!nameRegex.test(firstName)) {
      setError("First name must contain only letters");
      return;
    }

    if (!nameRegex.test(lastName)) {
      setError("Last name must contain only letters");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters and include 1 uppercase, 1 lowercase and 1 number"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        {
          firstName,
          lastName,
          email,
          password
        }
      );

      console.log("SIGNUP RESPONSE:", res.data); // 🔥 DEBUG

      if (res.data.success) {

        // ✅ Save email globally for next steps
        localStorage.setItem("email", email);

        setSuccess("Signup successful. OTP sent.");

        // ✅ IMMEDIATE NAVIGATION (FIXED)
        navigate(`/verify-otp?email=${email}`);

      } else {
        setError(res.data.message || "Signup failed");
      }

    } catch (err) {

      console.error("SIGNUP ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Signup failed. Try again."
      );

    } finally {
      setLoading(false);
    }

  };

  // ================= GOOGLE SIGNUP =================
  const handleGoogleSignup = () => {
    window.location.href =
      `${API_URL}/api/auth/google`;
  };

  return (

    <div className="min-h-screen flex bg-[#020a18] text-white">

      {/* LEFT IMAGE */}
      <motion.div
        className="hidden md:flex w-1/2"
        style={{
          backgroundImage: `url(${tradingBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* RIGHT FORM */}
      <motion.div className="w-full md:w-1/2 flex items-center justify-center">

        <div className="w-full max-w-md p-10 bg-[#081830] rounded-xl 
                        border border-cyan-400/30 
                        shadow-lg 
                        shadow-[0_0_35px_rgba(34,211,238,0.4)] 
                        hover:shadow-[0_0_55px_rgba(34,211,238,0.8)] 
                        transition-all duration-500">

          <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400">
            Create AI Trading Account
          </h2>

          {/* GOOGLE BUTTON */}
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white text-black py-3 rounded mb-4 hover:bg-gray-200"
          >
            Continue with Google
          </button>

          <div className="text-center mb-4 text-gray-400">
            or signup with email
          </div>

          {/* FIRST NAME */}
          <input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[A-Za-z]*$/.test(value)) {
                setFirstName(value);
              }
            }}
            className="w-full p-3 mb-3 rounded bg-[#0a0f1c] outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

          {/* LAST NAME */}
          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[A-Za-z]*$/.test(value)) {
                setLastName(value);
              }
            }}
            className="w-full p-3 mb-3 rounded bg-[#0a0f1c] outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 mb-3 rounded bg-[#0a0f1c] outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 mb-3 rounded bg-[#0a0f1c] outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

          {/* ERROR */}
          {error &&
            <p className="text-red-400 mb-3 text-center">
              {error}
            </p>
          }

          {/* SUCCESS */}
          {success &&
            <p className="text-green-400 mb-3 text-center">
              {success}
            </p>
          }

          {/* SIGNUP BUTTON */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-cyan-500 py-3 rounded hover:bg-cyan-600 transition font-semibold"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* LOGIN */}
          <p className="text-center mt-4 text-gray-400">
            Already have account?
            <span
              onClick={()=>navigate("/login")}
              className="text-cyan-400 cursor-pointer ml-2 hover:underline"
            >
              Login
            </span>
          </p>

        </div>

      </motion.div>

    </div>
  );
}