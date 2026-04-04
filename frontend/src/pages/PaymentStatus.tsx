import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Modal } from "../components/Modal";
import { Timeline } from "../components/Timeline";
import { StatusBadge } from "../components/StatusBadge";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();
  
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  const isSuccess = status === "success";

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-slate-50 min-h-[calc(100vh-200px)]">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 max-w-lg w-full text-center relative overflow-hidden">
        
        {/* Animated background element for success */}
        {isSuccess && (
          <div className="absolute inset-0 bg-green-50/50 -z-10" />
        )}
        
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="relative">
               <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-50" />
               <CheckCircle2 className="h-24 w-24 text-green-500 relative z-10" />
            </div>
          ) : (
            <XCircle className="h-24 w-24 text-red-500" />
          )}
        </div>

        <h1 className={`text-3xl font-black mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          {isSuccess 
            ? 'Your booking is confirmed. A professional will be assigned to you shortly.' 
            : 'We could not process your payment at this time. Please try another payment method.'}
        </p>

        <div className="space-y-4">
          {isSuccess ? (
            <>
              <button 
                onClick={() => setTrackingModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-primary text-white shadow-md hover:shadow-lg hover:bg-primary-dark transition-all"
              >
                Track Your Order <ArrowRight className="h-5 w-5" />
              </button>
              <Link to="/services" className="block w-full py-4 font-bold text-gray-500 hover:text-gray-800 transition-colors">
                Book Another Service
              </Link>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate(-1)} // Go back to payment page
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-gray-900 text-white shadow-md hover:bg-gray-800 transition-all"
              >
                <RotateCcw className="h-5 w-5" /> Try Again
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Tracking Modal Component */}
      <Modal isOpen={trackingModalOpen} onClose={() => setTrackingModalOpen(false)} title="Live Order Tracking">
        <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Order #ORD-9821-XA</h3>
            <p className="text-gray-500 text-sm">Status Update</p>
          </div>
          <StatusBadge status="In Progress" />
        </div>
        
        <Timeline currentStage="Assigned" />
        
        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-4">
          <div className="bg-primary text-white rounded-full p-2 h-10 w-10 flex items-center justify-center font-bold">
            M
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Mohammad Ali (⭐ 4.8)</h4>
            <p className="text-sm text-gray-600 mt-1">Professional has been assigned and will be on their way soon.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
