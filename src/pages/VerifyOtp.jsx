

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtp() {

    const navigate = useNavigate();
    const location = useLocation();

    const email =
        new URLSearchParams(location.search).get("email") ||
        localStorage.getItem("email");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);

    const [timer, setTimer] = useState(30);
    const [resendEnabled, setResendEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    // ❌ Prevent crash if email missing
    if (!email) {
        return (
            <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
                Email missing. Please signup/login again.
            </div>
        );
    }

    // ================= TIMER =================
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setResendEnabled(true);
        }
    }, [timer]);

    // ================= INPUT =================
    const handleChange = (value, index) => {

        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5 && inputs.current[index + 1]) {
            inputs.current[index + 1].focus();
        }
    };

    // ================= BACKSPACE =================
    const handleKeyDown = (e, index) => {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0 &&
            inputs.current[index - 1]
        ) {
            inputs.current[index - 1].focus();
        }
    };

    // ================= PASTE =================
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text");

        if (!/^\d{6}$/.test(paste)) return;

        const newOtp = paste.split("");
        setOtp(newOtp);

        if (inputs.current[5]) {
            inputs.current[5].focus();
        }
    };

    // ================= VERIFY OTP =================
    const verifyOtp = async () => {

        const enteredOtp = otp.join("");

        if (enteredOtp.length !== 6) {
            alert("Enter full OTP");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "http://localhost:5000/api/auth/verify-otp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        otp: enteredOtp
                    })
                }
            );

            const data = await res.json();

            console.log("VERIFY OTP RESPONSE:", data);

            // ✅ HANDLE ERRORS PROPERLY
            if (!res.ok || !data.success) {
                alert(data.message || "OTP verification failed");
                setLoading(false);
                return;
            }

            // 🔥 SAFE CHECK
            const isPinSet = data.isPinSet ?? false;

            // 🔥 FINAL FLOW
            if (isPinSet) {
                navigate(`/verify-pin?email=${email}`);
            } else {
                navigate(`/set-pin?email=${email}`);
            }

        } catch (err) {
            console.error("VERIFY OTP ERROR:", err);
            alert("Server error. Try again.");
        }

        setLoading(false);
    };

    // ================= RESEND OTP =================
    const resendOtp = async () => {

        try {
            const res = await fetch(
                "http://localhost:5000/api/auth/request-otp",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                }
            );

            const data = await res.json();

            if (data.success) {
                setTimer(30);
                setResendEnabled(false);
                alert("OTP resent");
            } else {
                alert(data.message || "Failed to resend OTP");
            }

        } catch (err) {
            console.error("RESEND ERROR:", err);
            alert("Failed to resend OTP");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <h2 style={styles.title}>Verify OTP</h2>

                <p style={styles.subtitle}>
                    Enter 6-digit code sent to
                </p>

                <p style={styles.email}>{email}</p>

                <div style={styles.otpBox} onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            ref={(el) => inputs.current[index] = el}
                            onChange={(e) =>
                                handleChange(e.target.value, index)
                            }
                            onKeyDown={(e) =>
                                handleKeyDown(e, index)
                            }
                            style={styles.input}
                        />
                    ))}
                </div>

                <button
                    style={styles.button}
                    onClick={verifyOtp}
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <p style={styles.timer}>
                    {resendEnabled ? (
                        <span style={styles.resend} onClick={resendOtp}>
                            Resend OTP
                        </span>
                    ) : (
                        "Resend in " + timer + "s"
                    )}
                </p>

            </div>
        </div>
    );
}

// ================= STYLES =================
const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#0f172a,#1e293b)"
    },
    card: {
        background: "#0f172a",
        padding: "40px",
        borderRadius: "12px",
        textAlign: "center",
        color: "white",
        boxShadow: "0 0 20px #0ea5e9"
    },
    title: {
        marginBottom: "10px"
    },
    subtitle: {
        opacity: 0.7
    },
    email: {
        color: "#38bdf8",
        marginBottom: "20px"
    },
    otpBox: {
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        marginBottom: "20px"
    },
    input: {
        width: "45px",
        height: "55px",
        fontSize: "22px",
        textAlign: "center",
        borderRadius: "8px",
        border: "1px solid #38bdf8",
        background: "#020617",
        color: "white"
    },
    button: {
        width: "100%",
        padding: "12px",
        background: "#0ea5e9",
        border: "none",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer"
    },
    timer: {
        marginTop: "15px"
    },
    resend: {
        color: "#38bdf8",
        cursor: "pointer"
    }
};