import { useState, useEffect } from "react";
import { sendOtp, verifyOtp } from "../services/authServices";
import { useAuth } from "../context/AuthContext";

export const useOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [timer, setTimer] = useState(120);
  const [error, setError] = useState("");
  const { login } = useAuth();

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const validateEmail = (email: string) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleSendOtp = async () => {
    setError("");

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    // Optimistically show OTP screen
    setStep("otp");
    setTimer(120);

    try {
      await sendOtp(email);
    } catch {
      setError("Failed to send OTP. Please try again.");
      setStep("email"); // Revert back if sending OTP fails
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    try {
      const response = await verifyOtp(email, otp);
      login(response.data.token, response.data.userId);
    } catch {
      setError("Invalid OTP");
    }
  };

  const resendOtp = () => {
    if (timer === 0) {
      handleSendOtp();
    }
  };

  return {
    email,
    setEmail,
    otp,
    setOtp,
    step,
    timer,
    error,
    handleSendOtp,
    handleVerifyOtp,
    resendOtp,
  };
};
