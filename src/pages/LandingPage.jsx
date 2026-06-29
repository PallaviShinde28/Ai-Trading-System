import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import tradingPhone from "../assets/Social_Media_Templates-removebg-preview.png";
import person1 from "../assets/person1.jpg";
import person2 from "../assets/person2.jpg";
import person3 from "../assets/person3.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  return (
    <div className="min-h-screen w-full font-sans text-white overflow-x-hidden overflow-y-auto relative">
      {/* === BACKGROUND === */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(15,25,40,0.9), rgba(10,15,30,1)), linear-gradient(180deg, #0a0d15 0%, #0b1220 60%, #08111f 100%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          animation: "bgShift 20s ease-in-out infinite alternate",
        }}
      ></div>

      <div className="fixed inset-0 -z-10 opacity-30 bg-gradient-to-br from-teal-900/40 via-blue-900/30 to-black"></div>

      <style>{`
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex justify-between items-center px-10 py-6 fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm"
      >
        <h1 className="text-2xl font-extrabold tracking-wider text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          INVSTO
        </h1>
        <div className="flex items-center space-x-8 text-gray-200">
          {["Home", "Markets", "Features", "FAQ", "Testimonials"].map((link, i) => (
            <button
              key={i}
              className="hover:text-cyan-300 transition font-medium"
              onClick={() => {
                const section = document.getElementById(link.toLowerCase());
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {link}
            </button>
          ))}
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-md font-semibold text-gray-100 bg-transparent border border-cyan-400/40 hover:bg-cyan-700/20 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-700 rounded-md text-white font-semibold hover:scale-105 transition-all shadow-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ===== HERO SECTION ===== */}
      <section
        className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 h-screen pt-[7rem] relative overflow-hidden"
        id="home"
      >
        {/* LEFT TEXT */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="md:w-1/2 space-y-8 z-10"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-100">
            Trade Smarter with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500">
              AI-Powered Intelligence
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Harness AI-driven analysis and automation to revolutionize your
            trading — intuitive, fast, and secure.
          </p>
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 25px rgba(34,211,238,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-cyan-500 to-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-all shadow-md"
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          style={{ perspective: 1000 }}
          className="md:w-1/2 flex justify-center items-center mt-10 md:mt-0"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            x.set(e.clientX - rect.left - rect.width / 2);
            y.set(e.clientY - rect.top - rect.height / 2);
          }}
          onMouseLeave={() => {
            x.set(0);
            y.set(0);
          }}
        >
          <motion.div
            style={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0], rotateZ: [0, 2, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500 via-blue-700 to-indigo-700 blur-[180px] opacity-25 rounded-full"></div>
              <img
                src={tradingPhone}
                alt="AI Trading"
                className="relative w-[450px] md:w-[520px] object-contain drop-shadow-[0_0_70px_rgba(34,211,238,0.4)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== CORE FEATURES ===== */}
      <section className="py-24 px-10 md:px-20 text-white relative bg-transparent" id="features">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 text-cyan-300"
        >
          Core Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(34,211,238,0.3)",
              }}
              className="bg-gradient-to-br from-[#0b0f19]/90 to-[#101828]/90 rounded-xl p-10 text-center shadow-lg transition-all duration-300 backdrop-blur-md"
            >
              <div className="p-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-md">
                <i className={`${f.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <div className="w-16 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-3"></div>
              <p className="text-white/70 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-24 px-10 md:px-20 bg-transparent" id="faq">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 text-cyan-300"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="bg-gradient-to-br from-[#0b0f19]/80 to-[#101828]/80 p-6 rounded-lg backdrop-blur-md cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-cyan-100">{f.q}</h4>
                <span className="text-cyan-400 text-xl font-bold">
                  {openIndex === i ? "−" : "+"}
                </span>
              </div>
              {openIndex === i && (
                <p className="text-white/80 text-sm mt-3">{f.a}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-10 md:px-20 bg-transparent" id="testimonials">
        <h2 className="text-4xl font-bold text-center mb-8 text-cyan-300">
          What Our Traders Say
        </h2>
        <p className="text-center text-white/60 mb-14">
          Hear from traders who trust Invsto every day.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(34,211,238,0.3)",
              }}
              className="bg-gradient-to-br from-[#0b0f19]/90 to-[#101828]/90 p-8 rounded-xl text-center shadow-md backdrop-blur-md"
            >
              <img
                src={t.photo}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-cyan-400"
              />
              <p className="text-white/80 italic mb-4">"{t.review}"</p>
              <h4 className="text-cyan-200 font-semibold">{t.name}</h4>
              <p className="text-white/60 text-sm">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 text-center bg-transparent backdrop-blur-sm">
        <h1 className="text-cyan-400 font-bold text-xl mb-2">INVSTO</h1>
        <p className="text-white/70 text-sm">
          Empowering traders with AI intelligence and next-generation analytics.
        </p>
        <p className="text-white/50 mt-2 text-sm">
          © {new Date().getFullYear()} Invsto. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

/* === DATA === */
const features = [
  { icon: "fas fa-brain", title: "AI Market Predictions", desc: "Our AI engine analyzes market patterns and forecasts profitable outcomes." },
  { icon: "fas fa-bolt", title: "Instant Execution", desc: "Lightning-fast order execution ensures you never miss profitable opportunities." },
  { icon: "fas fa-lock", title: "Secure Trading", desc: "End-to-end encryption and 2FA keep your data safe." },
  { icon: "fas fa-chart-line", title: "Real-Time Analytics", desc: "Visualize live trends with AI-powered dashboards." },
  { icon: "fas fa-robot", title: "Smart Automation", desc: "Let AI automate trades and portfolio adjustments for you." },
  { icon: "fas fa-sync", title: "Seamless Integration", desc: "Access your dashboard from any device, anytime." },
];

const faqs = [
  { q: "What is Invsto?", a: "An AI-powered trading platform that automates smart trading." },
  { q: "Can I automate trades?", a: "Yes, you can set AI-based strategies and triggers easily." },
  { q: "Is my data secure?", a: "Absolutely. We use top-grade encryption and 2FA security." },
  { q: "Is it mobile-friendly?", a: "Yes, fully optimized for all devices." },
];

const testimonials = [
  {
    photo: person1,
    name: "Sarah Patel",
    role: "Investor",
    review: "Invsto changed how I trade — efficient and smart!",
  },
  {
    photo: person2,
    name: "David Lee",
    role: "Crypto Enthusiast",
    review: "AI predictions are incredibly accurate and reliable!",
  },
  {
    photo: person3,
    name: "Priya Sharma",
    role: "Stock Trader",
    review: "Love the futuristic design and automation features!",
  },
]; 