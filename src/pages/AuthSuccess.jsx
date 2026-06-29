import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    console.log("AUTH SUCCESS EMAIL:", email);

    if (email) {
      localStorage.setItem("email", email);
    }

    navigate("/dashboard");

  }, []);

  return <div style={{ color: "white" }}>Logging you in...</div>;
}