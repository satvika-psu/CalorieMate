import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl =
  process.env.NODE_ENV === "production"
    ? "https://caloriemate-server.vercel.app"
    : "http://localhost:5000";

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignout = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/signout`);

        if (response.status === 200) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error during sign out:", error);
      }
    };

    handleSignout();
  }, [navigate]);

  return <div>Signing out...</div>;
};

export default Signout;
