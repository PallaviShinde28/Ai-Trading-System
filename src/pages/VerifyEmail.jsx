import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";

export default function VerifyEmail() {

  const navigate = useNavigate();

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Check verification status
  useEffect(() => {

    const checkVerification = async () => {

      if (!auth.currentUser) {
        navigate("/signup");
        return;
      }

      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        setVerified(true);
      }

      setLoading(false);

    };

    checkVerification();

    // Auto refresh every 3 seconds
    const interval = setInterval(async () => {

      if (auth.currentUser) {

        await auth.currentUser.reload();

        if (auth.currentUser.emailVerified) {

          setVerified(true);
          clearInterval(interval);

        }

      }

    }, 3000);

    return () => clearInterval(interval);

  }, []);


  // Continue button
  const handleContinue = () => {

    // change next step here
    navigate("/verify-otp");

    // OR navigate("/kyc-process");
    // OR navigate("/dashboard");

  };


  // Resend email
  const resendEmail = async () => {

    try {

      setSending(true);

      await sendEmailVerification(auth.currentUser);

      alert("Verification email sent again");

    }
    catch {

      alert("Failed to send email");

    }
    finally {

      setSending(false);

    }

  };


  // Loading screen
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020a18] to-[#1e3a8a] text-white">

        <div className="text-center">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>

          <p className="text-lg">Checking verification status...</p>

        </div>

      </div>

    );

  }


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020a18] via-[#020a18] to-[#1e3a8a] text-white">

      <div className="bg-[#0f172a] w-full max-w-md p-10 rounded-2xl shadow-2xl border border-cyan-500/20 text-center">

        <h1 className="text-3xl font-bold text-cyan-400 mb-3">
          AI Trading System
        </h1>

        <p className="text-gray-400 mb-6">
          Email Verification
        </p>


        {verified ? (

          <>
            <div className="text-green-400 text-lg mb-4">
              ✅ Email Verified Successfully
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-lg font-semibold hover:scale-105 transition"
            >
              Continue to Next Step
            </button>
          </>

        ) : (

          <>
            <div className="text-yellow-400 text-lg mb-3">
              ⏳ Waiting for Email Verification
            </div>

            <p className="text-gray-400 mb-6">
              Please check your email inbox and click the verification link.
            </p>

            <button
              onClick={resendEmail}
              disabled={sending}
              className="w-full bg-gray-700 py-3 rounded-lg hover:bg-gray-600 transition"
            >
              {sending ? "Sending..." : "Resend Verification Email"}
            </button>
          </>

        )}

      </div>

    </div>

  );

}
