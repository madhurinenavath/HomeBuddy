import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Mail, CheckCircle, Lock } from "lucide-react";
import { FormLayout } from "../components/FormLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      console.log("Your Recovery OTP is: " + newOtp);
      setStep(2);
      setError("");
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login", { state: { message: "Password reset successfully! Please login." } });
    }, 1500);
  };

  return (
    <FormLayout 
      title={step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"} 
      subtitle={
        step === 1 ? "Enter your email to receive a recovery code." :
        step === 2 ? "Enter the 4-digit code sent to your email." :
        "Create a strong new password."
      }
      icon={<KeyRound className="h-8 w-8 text-primary" />}
    >
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            error={error}
            leftIcon={<Mail className="h-5 w-5" />}
          />
          <Button type="submit" fullWidth isLoading={isLoading}>
            Send Recovery Code
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium flex items-start gap-3 mb-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              Code sent to {email}. 
              <br/><span className="text-xs opacity-80">(Check your browser console!)</span>
            </div>
          </div>
          
          <Input
            label="Enter OTP"
            type="text"
            placeholder="• • • •"
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(""); }}
            error={error}
            maxLength={4}
            className="text-center tracking-[1em] text-xl font-bold"
          />
          
          <Button type="submit" fullWidth>
            Verify Code
          </Button>
          
          <button 
            type="button"
            className="w-full text-center text-sm font-bold text-primary hover:underline"
            onClick={() => {
              const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
              setGeneratedOtp(newOtp);
              console.log("Your new Recovery OTP is: " + newOtp);
              setOtp("");
              setError("");
            }}
          >
            Resend OTP
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <Input
            label="New Password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            error={error}
            leftIcon={<Lock className="h-5 w-5" />}
          />
          <Button type="submit" fullWidth isLoading={isLoading}>
            Update Password
          </Button>
        </form>
      )}

      <div className="mt-8 text-center text-sm">
        <Link to="/login" className="text-gray-500 font-bold hover:text-gray-900 transition-colors">
          &larr; Back to Login
        </Link>
      </div>
    </FormLayout>
  );
}
