import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignout = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/signout");

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
