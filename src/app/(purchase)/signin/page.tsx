'use client';
import { useEffect, useState } from 'react';
import { sendOTPService, verifyOTPService } from '@/server/actions/authService';
import { useAuth } from '@/context/AuthContext';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [timer, setTimer] = useState(120);
  const [error, setError] = useState('');
  const { login } = useAuth();

  // Timer effect
  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const validateEmail = (email: string) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleSendOtp = async () => {
    setError('');
    if (!validateEmail(email)) {
      setError('Invalid email');
      return;
    }
    setStep('otp');
    setTimer(120);
    try {
      await sendOTPService(email);
    } catch {
      setError('Failed to send OTP. Please try again.');
      setStep('email');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    try {
      const response = await verifyOTPService(email, otp);
      login(response.token, response.userId);
    } catch {
      setError('Invalid OTP');
    }
  };

  const resendOtp = () => {
    if (timer === 0) {
      handleSendOtp();
    }
  };

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

        {step === 'email' && (
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

        {step === 'otp' && (
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
