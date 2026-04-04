import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck, Wallet, Landmark, Banknote, Smartphone, ExternalLink } from "lucide-react";
import { useCart } from "../CartContext";
import { Modal } from "../components/Modal";

const banks = [
  "State Bank of India (SBI)",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank"
];

export default function Payment() {
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const address = searchParams.get("address") || "Address not provided";
  const navigate = useNavigate();

  const { cart, subtotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [errorMessage, setErrorMessage] = useState("");

  // Input states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankUserId, setBankUserId] = useState("");

  // Modal States
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiTimer, setUpiTimer] = useState(30);

  // UPI Timer side-effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (upiModalOpen && upiTimer > 0) {
      interval = setInterval(() => {
        setUpiTimer((prev) => prev - 1);
      }, 1000);
    } else if (upiModalOpen && upiTimer === 0) {
      setUpiModalOpen(false);
      navigate('/payment-status?status=fail');
    }
    return () => clearInterval(interval);
  }, [upiModalOpen, upiTimer, navigate]);

  if (cart.length === 0 || !date || !time) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid booking details</h2>
          <p className="text-gray-500 mb-6">Your cart is empty or the schedule details are missing.</p>
          <button onClick={() => navigate('/services')} className="bg-primary text-white font-bold w-full py-4 rounded-xl hover:bg-primary-dark transition-colors">Return to services</button>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    setErrorMessage("");
    setIsProcessing(true);
    
    // Evaluation Logic
    let isValid = false;

    if (paymentMethod === 'upi') {
      isValid = upiId.trim().length > 0;
      if (!isValid) setErrorMessage("Please enter your UPI ID.");
    } else if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      const isCardValidLength = cleanCard.length === 12;
      const isCvvValidLength = cardCvv.length === 3;
      
      let isDateValid = false;
      const [mm, yy] = cardExpiry.split("/");
      if (mm && yy && mm.length === 2 && yy.length === 2) {
         const month = parseInt(mm, 10);
         const year = parseInt(yy, 10);
         
         // Above March 2026 means Year must be > 26 or Year == 26 and month > 3
         if (month >= 1 && month <= 12) {
            if (year > 26) {
               isDateValid = true;
            } else if (year === 26 && month > 3) {
               isDateValid = true;
            }
         }
      }

      isValid = isCardValidLength && isCvvValidLength && isDateValid;
      if (!isValid) {
        setErrorMessage("Invalid Card! Requires exactly 12 digits, 3-digit CVV, and expiry strictly after 03/26.");
      }
    } else if (paymentMethod === 'netbanking') {
      isValid = selectedBank.length > 0 && bankUserId.trim().length > 0;
      if (!isValid) setErrorMessage("Please select a bank and enter Customer ID.");
    } else if (paymentMethod === 'cod') {
      isValid = true;
    }

    setTimeout(() => {
      setIsProcessing(false);
      
      if (!isValid) return; // Wait! Don't route to fail entirely on simple validation mistakes. Give them a chance to fix it.

      // If valid, branch by method
      if (paymentMethod === 'card' || paymentMethod === 'netbanking') {
        setOtpModalOpen(true);
      } else if (paymentMethod === 'upi') {
        setUpiTimer(30);
        setUpiModalOpen(true);
      } else {
        // Direct Success for COD
        clearCart();
        navigate(`/payment-status?status=success&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
      }
    }, 1000); // reduced delay for snappier feedback
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) return;
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      setOtpModalOpen(false);
      clearCart();
      navigate(`/payment-status?status=success&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
    }, 2000);
  };

  const handleUPIAppClick = () => {
     // Mocking deep link resolution success instantly
     setUpiModalOpen(false);
     clearCart();
     navigate(`/payment-status?status=success&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
  };

  const totalAmount = (subtotal * 1.18).toFixed(2);

  return (
    <div className="flex-grow bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Payment Options */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Select Payment Method
          </h1>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            
            {/* Option 1 */}
            <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="mt-1">
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => {setPaymentMethod('upi'); setErrorMessage("");}} className="w-5 h-5 text-primary focus:ring-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
                  <Wallet className="h-5 w-5 text-purple-500" /> UPI (GPay, PhonePe, Paytm)
                </div>
                <p className="text-sm text-gray-500 mt-1">Fast and secure payment using any UPI app.</p>
                {paymentMethod === 'upi' && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <input 
                      type="text" 
                      placeholder="Enter Mobile Number or UPI ID" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                  </div>
                )}
              </div>
            </label>

            {/* Option 2 */}
            <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="mt-1">
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => {setPaymentMethod('card'); setErrorMessage("");}} className="w-5 h-5 text-primary focus:ring-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
                  <CreditCard className="h-5 w-5 text-blue-500" /> Credit / Debit Card
                </div>
                <p className="text-sm text-gray-500 mt-1">Supports Visa, Mastercard, RuPay.</p>
                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <input 
                      type="text" 
                      placeholder="Card Number (Exactly 12 Digits)" 
                      value={cardNumber}
                      maxLength={12}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        maxLength={5}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-1/2 px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                      />
                      <input 
                        type="password" 
                        placeholder="CVV (3 Digits)" 
                        value={cardCvv}
                        maxLength={3}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-1/2 px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </label>

            {/* Option 3 */}
            <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="mt-1">
                <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => {setPaymentMethod('netbanking'); setErrorMessage("");}} className="w-5 h-5 text-primary focus:ring-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
                  <Landmark className="h-5 w-5 text-indigo-500" /> Net Banking
                </div>
                <p className="text-sm text-gray-500 mt-1">All major Indian banks supported.</p>
                {paymentMethod === 'netbanking' && (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white font-medium"
                    >
                      <option value="">Select your Bank</option>
                      {banks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    {selectedBank && (
                      <input 
                        type="text" 
                        placeholder="Enter Customer ID / User ID" 
                        value={bankUserId}
                        onChange={(e) => setBankUserId(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none animate-in fade-in" 
                      />
                    )}
                  </div>
                )}
              </div>
            </label>

             {/* Option 4 */}
             <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="mt-1">
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => {setPaymentMethod('cod'); setErrorMessage("");}} className="w-5 h-5 text-primary focus:ring-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
                  <Banknote className="h-5 w-5 text-green-600" /> Pay After Service
                </div>
                <p className="text-sm text-gray-500 mt-1">Pay with cash or online after the work is done.</p>
              </div>
            </label>

          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
                 {cart.map(item => (
                   <div key={item.serviceId} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-700 text-sm truncate max-w-[170px]">{item.name}</span>
                      <span className="font-bold text-gray-900 text-sm">₹{item.price}</span>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                <span className="text-gray-500">Service total</span>
                <span className="font-bold text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-500">Scheduled</span>
                <span className="font-medium text-gray-800 text-right">{date} <br/> {time}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-500 flex-shrink-0">Service Location</span>
                <span className="font-medium text-gray-800 text-right max-w-[200px] truncate ml-4" title={address}>{address}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Taxes (18% GST)</span>
                <span className="font-bold text-gray-900">₹{(subtotal * 0.18).toFixed(2)}</span>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xl">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-black text-primary">₹{totalAmount}</span>
            </div>
            
            <div className="p-6 pt-0 bg-gray-50">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 animate-in fade-in">
                  {errorMessage}
                </div>
              )}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all focus:ring-4 focus:ring-primary/20 ${isProcessing ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg'}`}
              >
                {isProcessing ? 'Processing securely...' : paymentMethod === 'cod' ? 'Confirm Booking' : `Pay ₹${totalAmount}`}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                 <ShieldCheck className="h-4 w-4 text-green-500" />
                 100% Secure Transaction
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* OTP Verification Modal */}
      <Modal isOpen={otpModalOpen} onClose={() => setOtpModalOpen(false)} title="Security Verification">
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Smartphone className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Enter OTP</h3>
          <p className="text-gray-500 text-sm mb-6">We've sent a secure One Time Password to your registered mobile number ending in ****210.</p>
          
          <input 
            type="text" 
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} // Numeric only
            placeholder="• • • • • •" 
            className="w-full max-w-[200px] text-center tracking-widest text-2xl font-black px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none mb-8" 
          />
          
          <button
            onClick={handleVerifyOtp}
            disabled={otpCode.length < 4 || isVerifyingOtp}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-white text-lg ${
              (otpCode.length < 4 || isVerifyingOtp) ? 'bg-primary/60 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark hover:shadow-lg'
            }`}
          >
            {isVerifyingOtp ? 'Verifying...' : 'Verify & Pay'}
          </button>
          
          <p className="text-primary font-bold text-sm mt-6 cursor-pointer hover:underline">Resend OTP</p>
        </div>
      </Modal>

      {/* UPI Intent Modal */}
      <Modal isOpen={upiModalOpen} onClose={() => setUpiModalOpen(false)} title="Complete UPI Payment">
         <div className="flex flex-col items-center text-center p-4">
             <div className="w-20 h-20 relative flex items-center justify-center mb-6">
               {/* Animated Timer Border Visualization */}
               <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke="#6d28d9" strokeWidth="6" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * (upiTimer / 30))}
                    className="transition-all duration-1000 ease-linear"
                  />
               </svg>
               <span className="absolute font-black text-2xl text-gray-800">{upiTimer}s</span>
             </div>

             <h3 className="font-bold text-xl text-gray-900 mb-2">Awaiting Payment</h3>
             <p className="text-gray-500 text-sm mb-8 px-4">
               A payment request of <strong>₹{totalAmount}</strong> has been created. Please complete it in your UPI app within the time limit.
             </p>

             <button 
                onClick={handleUPIAppClick}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dark transition-colors"
             >
                <ExternalLink className="h-5 w-5" /> Open UPI App & Pay
             </button>
         </div>
      </Modal>

    </div>
  );
}
