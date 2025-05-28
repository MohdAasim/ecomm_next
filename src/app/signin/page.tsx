"use client";
import { useOtp } from "../../hooks/useOtp";
import "./SignIn.css";

const SignIn = () => {
  const {
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
  } = useOtp();

  return (
    <div className="signin-container">
      <div className="info-box">
        <h2>Welcome to Ecomm</h2>
        <ul>
          <li>✔ Buy premium products</li>
          <li>✔ Fast checkout</li>
          <li>✔ Secure payments</li>
        </ul>
      </div>

      <div className="form-box">
        <h2>Ecomm</h2>

        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendOtp}>Send OTP</button>
          </>
        )}

        {step === "otp" && (
          <>
            <p>
              OTP sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
            <p>
              {timer > 0 ? (
                `Resend OTP in ${timer}s`
              ) : (
                <button onClick={resendOtp}>Resend OTP</button>
              )}
            </p>
          </>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
