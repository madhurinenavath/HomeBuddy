import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn, CheckCircle } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      console.log("Your OTP is: " + newOtp);
      setOtpError("");
      setOtp("");
      setOtpSent(true);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      const names = ["Aarav Sharma", "Vivaan Singh", "Diya Patel", "Ananya Gupta", "Rohan Malhotra", "Kavya Desai", "Neha Sharma"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${randomName}`;
      localStorage.setItem("userName", randomName);
      localStorage.setItem("userAvatar", avatarUrl);
      navigate('/profile');
    } else {
      setOtpError("OTP is invalid");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 sm:p-8 bg-slate-50 min-h-[calc(100vh-200px)]">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary/10 p-3 rounded-xl mb-4">
            {isLogin ? <LogIn className="h-8 w-8 text-primary" /> : <UserPlus className="h-8 w-8 text-primary" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Create an Account'}</h1>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? 'Enter your phone number to login safely via OTP.' : 'Join us today to book reliable home services.'}
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10 digit number"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium flex items-start gap-3 mb-6">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                We've sent a 4-digit code to +91 {phone}. 
                <br/><span className="text-xs opacity-80">(Check your browser console!)</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Enter OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ''));
                  setOtpError("");
                }}
                placeholder="• • • •"
                className={`w-full px-4 py-3 text-center tracking-[1em] text-xl rounded-xl border ${otpError ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} focus:ring-2 outline-none transition-all`}
                required
                maxLength={4}
              />
              {otpError && <p className="text-red-500 text-sm font-bold mt-2">{otpError}</p>}
            </div>
            <button type="submit" className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-sm">
              Verify & Login
            </button>
            <p 
              className="text-primary font-bold text-sm mt-4 text-center cursor-pointer hover:underline"
              onClick={() => {
                const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
                setGeneratedOtp(newOtp);
                console.log("Your new OTP is: " + newOtp);
                setOtpError("");
                setOtp("");
              }}
            >
              Resend OTP
            </p>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button onClick={() => { setIsLogin(!isLogin); setOtpSent(false); }} className="text-primary font-bold hover:underline">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>

      </div>
    </div>
  );
}
