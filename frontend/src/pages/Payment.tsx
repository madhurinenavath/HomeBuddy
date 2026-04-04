import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { services } from "../utils/data";
import { CreditCard, ShieldCheck, Wallet, Landmark, Banknote } from "lucide-react";

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
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const address = searchParams.get("address") || "Address not provided";
  const navigate = useNavigate();

  const service = services.find(s => s.serviceId === serviceId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");

  // Input states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankUserId, setBankUserId] = useState("");

  if (!service || !date || !time) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid booking details</h2>
          <button onClick={() => navigate('/services')} className="text-primary font-bold hover:underline">Return to services</button>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Evaluation Logic
    let isValid = false;

    if (paymentMethod === 'upi') {
      isValid = upiId.trim().length > 0;
    } else if (paymentMethod === 'card') {
      isValid = cardNumber.trim().length > 0 && cardExpiry.trim().length > 0 && cardCvv.trim().length > 0;
    } else if (paymentMethod === 'netbanking') {
      isValid = selectedBank.length > 0 && bankUserId.trim().length > 0;
    } else if (paymentMethod === 'cod') {
      isValid = true; // Cash on delivery is always successful
    }

    setTimeout(() => {
      setIsProcessing(false);
      // Route based on validation
      if (isValid) {
        navigate('/payment-status?status=success');
      } else {
        navigate('/payment-status?status=fail');
      }
    }, 1500);
  };

  const totalAmount = (service.price * 1.18).toFixed(2);

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
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 text-primary focus:ring-primary" />
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
                      placeholder="Enter UPI ID (eg. name@okicici)" 
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
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-primary focus:ring-primary" />
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
                      placeholder="Card Number" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-1/2 px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                      />
                      <input 
                        type="text" 
                        placeholder="CVV" 
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
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
                <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="w-5 h-5 text-primary focus:ring-primary" />
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
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-primary focus:ring-primary" />
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
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">{service.name}</span>
                <span className="font-bold text-gray-900">₹{service.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-500">Scheduled Date</span>
                <span className="font-medium text-gray-800">{date}</span>
              </div>
               <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-500">Scheduled Time</span>
                <span className="font-medium text-gray-800">{time}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                <span className="text-gray-500 flex-shrink-0">Service Location</span>
                <span className="font-medium text-gray-800 text-right max-w-xs truncate ml-4" title={address}>{address}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Taxes (18% GST)</span>
                <span className="font-bold text-gray-900">₹{(service.price * 0.18).toFixed(2)}</span>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xl">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-black text-primary">₹{totalAmount}</span>
            </div>
            
            <div className="p-6 pt-0 bg-gray-50">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all ${isProcessing ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary/20'}`}
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
    </div>
  );
}
