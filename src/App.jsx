import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Existing pages
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import VerifyPin from "./pages/VerifyPin";
import VerifyOtp from "./pages/VerifyOtp";
import PanVerification from "./pages/PanVerification";
import KycSuccess from "./pages/KycSuccess";
import KycProcess from "./pages/KycProcess";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import SetPin from "./pages/SetPin";
import VerifyEmailSuccess from "./pages/VerifyEmailSuccess";
import ChartPage from "./pages/ChartPage";
import AuthSuccess from "./pages/AuthSuccess";

// Dashboard pages
import Trade from "./pages/Trade";
import Portfolio from "./pages/Portfolio";
import TradeHistory from "./pages/TradeHistory";
import Market from "./pages/Market";
import MarketDetail from "./pages/MarketDetail";
import AIPredictions from "./pages/AIPredictions";
import NewsDashboard from "./pages/NewsDashboard";

// 🔥 ADD THIS IMPORT
import AutoTrading from "./pages/AutoTrading";



// Styles
import "./ai.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth-success" element={<AuthSuccess />} />

        {/* Verification */}
        <Route path="/verify-pin" element={<VerifyPin />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email-success" element={<VerifyEmailSuccess />} />
        <Route path="/set-pin" element={<SetPin />} />

        {/* KYC */}
        <Route path="/pan-verification" element={<PanVerification />} />
        <Route path="/kyc-process" element={<KycProcess />} />
        <Route path="/kyc-success" element={<KycSuccess />} />

        {/* ✅ DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />}>

          {/* Default page */}
          <Route index element={<Overview />} />

          {/* Nested pages */}
          <Route path="overview" element={<Overview />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="trade" element={<Trade />} />
          <Route path="history" element={<TradeHistory />} />

          {/* Market */}
          <Route path="market" element={<Market />} />
          <Route path="market/:symbol" element={<MarketDetail />} />

          {/* AI Predictions */}
          <Route path="ai-predictions" element={<AIPredictions />} />

          {/* 📰 News Sentiment */}
          <Route path="news" element={<NewsDashboard />} />

          {/* 🔥 NEW: AUTO TRADING */}
          <Route path="auto-trading" element={<AutoTrading />} />
          

        </Route>

        {/* Chart */}
        <Route path="/chart/:symbol" element={<ChartPage />} />

      </Routes>
    </Router>
  );
};

export default App;