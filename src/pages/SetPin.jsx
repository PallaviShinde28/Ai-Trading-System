
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SetPin() {

  const navigate = useNavigate();
  const location = useLocation();

  const queryEmail =
    new URLSearchParams(location.search).get("email");

  const email =
    queryEmail || localStorage.getItem("email");

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= SAVE PIN =================
  const handleSetPin = async () => {

    if (!email) {
      alert("Session expired. Please signup again.");
      return;
    }

    if (pin.length !== 4) {
      alert("PIN must be 4 digits");
      return;
    }

    if (confirmPin.length !== 4) {
      alert("Confirm PIN properly");
      return;
    }

    if (pin !== confirmPin) {
      alert("PIN does not match");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:5000/api/auth/set-pin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            pin
          })
        }
      );

      const data = await res.json();

      console.log("SET PIN RESPONSE:", data);

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to set PIN");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS
      alert("PIN set successfully");

      // 🔥 IMPORTANT CHANGE HERE
      navigate(`/kyc-process?email=${email}`);

    } catch (err) {

      console.error("SET PIN ERROR:", err);
      alert("Server error. Try again.");

    }

    setLoading(false);
  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>
          Set your 4-digit PIN
        </h2>

        <p style={styles.subtitle}>
          This PIN will be used for secure login
        </p>

        {/* PIN */}
        <input
          type={showPin ? "text" : "password"}
          maxLength="4"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, ""))
          }
          style={styles.input}
        />

        {/* CONFIRM PIN */}
        <input
          type={showPin ? "text" : "password"}
          maxLength="4"
          placeholder="Confirm PIN"
          value={confirmPin}
          onChange={(e) =>
            setConfirmPin(e.target.value.replace(/\D/g, ""))
          }
          style={styles.input}
        />

        {/* SHOW PIN */}
        <p
          style={styles.show}
          onClick={() => setShowPin(!showPin)}
        >
          {showPin ? "Hide PIN" : "Show PIN"}
        </p>

        {/* BUTTON */}
        <button
          style={styles.button}
          onClick={handleSetPin}
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>

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
    background:
      "linear-gradient(135deg,#020617,#0f172a)"
  },
  card: {
    background: "#020617",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 0 20px #0ea5e9"
  },
  title: {
    color: "white",
    marginBottom: "10px"
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #0ea5e9",
    background: "#020617",
    color: "white",
    fontSize: "18px",
    textAlign: "center"
  },
  show: {
    color: "#38bdf8",
    cursor: "pointer",
    marginBottom: "20px"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#0ea5e9",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  }
};