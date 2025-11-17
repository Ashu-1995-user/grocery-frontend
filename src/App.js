import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API || "http://localhost:8080";

function App() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const sendMobile = async () => {
    try {
      const resp = await axios.post(`${API_BASE}/authenticate`, { mobileNumber: mobile });
      setMessage(resp.data?.message || "OTP sent");
      setStep(1);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const resp = await axios.post(`${API_BASE}/verifyOTP`, {
        mobileNumber: mobile,
        otp,
      });

      const token = resp.data?.data?.token;
      localStorage.setItem("token", token);
      setMessage("Login success");

      // ⭐ Navigate to home screen
      navigate("/home");

    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Login</h2>

      {step === 0 ? (
        <>
          <input placeholder="Mobile number" value={mobile} onChange={e => setMobile(e.target.value)} />
          <button onClick={sendMobile}>Send OTP</button>
        </>
      ) : (
        <>
          <div>OTP sent to {mobile}</div>
          <input placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify</button>
        </>
      )}

      <div style={{ marginTop: 16, color: "green" }}>{message}</div>
    </div>
  );
}

export default App;
