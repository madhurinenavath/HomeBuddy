import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { services } from "../utils/data";
import { Stepper } from "../components/Stepper";
import { CartItemCard } from "../components/CartItemCard";
import { ArrowRight, ArrowLeft, MapPin, Calendar as CalendarIcon, Clock, ShieldCheck, Map } from "lucide-react";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const navigate = useNavigate();

  const service = services.find(s => s.serviceId === serviceId);

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Cart", "Schedule", "Address", "Summary"];

  // Booking details state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  if (!service) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Service not found</h2>
          <button onClick={() => navigate('/services')} className="text-primary font-bold hover:underline">Return to services</button>
        </div>
      </div>
    );
  }

  // --- Mock Data Setups ---
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
  const day3 = new Date(); day3.setDate(today.getDate() + 2);
  
  const formattedDates = [
    { label: "Today", value: today.toISOString().split('T')[0], dayStr: today.toLocaleDateString('en-US', {weekday: 'short'}) },
    { label: "Tomorrow", value: tomorrow.toISOString().split('T')[0], dayStr: tomorrow.toLocaleDateString('en-US', {weekday: 'short'}) },
    { label: day3.toLocaleDateString('en-US', {day:'numeric', month:'short'}), value: day3.toISOString().split('T')[0], dayStr: day3.toLocaleDateString('en-US', {weekday: 'short'}) }
  ];
  const slots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

  const [addresses, setAddresses] = useState([
    { id: 1, type: "Home", name: "Demo User", address: "Flat 4B, Signature Towers, MG Road, Gurgaon, 122002" },
    { id: 2, type: "Office", name: "Demo User", address: "Floor 3, Tech Park, Cyber City, Gurgaon, 122008" }
  ]);

  const handleDetectLocation = () => {
    setIsFindingLocation(true);
    setTimeout(() => {
      const newId = Date.now();
      setAddresses(prev => [
        { id: newId, type: "Current", name: "Demo User", address: "Detected Location (Lat: 28.4595, Lng: 77.0266)" },
        ...prev
      ]);
      setSelectedAddress(newId);
      setIsFindingLocation(false);
    }, 1500);
  };

  // Validation before going to next step
  const handleNext = () => {
    if (currentStep === 1 && (!selectedDate || !selectedSlot)) return;
    if (currentStep === 2 && selectedAddress === null) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Final step: Proceed to payment
      const addrDetails = addresses.find(a => a.id === selectedAddress)?.address || '';
      navigate(`/payment?serviceId=${service.serviceId}&date=${selectedDate}&time=${selectedSlot}&address=${encodeURIComponent(addrDetails)}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="flex-grow bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mb-16 px-4 sm:px-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* STEP 0: CART */}
          {currentStep === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
                <span className="text-sm font-medium text-gray-500">1 Item</span>
              </div>
              <CartItemCard service={service} />
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mt-6 flex gap-3 text-blue-800">
                 <ShieldCheck className="h-6 w-6 flex-shrink-0" />
                 <p className="text-sm">You are adding a single service to your cart. To add different services, complete this booking first or use our multi-booking feature (Coming soon).</p>
              </div>
            </div>
          )}

          {/* STEP 1: SCHEDULE */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
               <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <CalendarIcon className="h-6 w-6 text-primary" /> Pick a Schedule
               </h1>
               
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">Select Date</h3>
                  <div className="flex flex-wrap gap-4">
                    {formattedDates.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDate(d.value)}
                        className={`flex flex-col items-center justify-center py-4 px-6 rounded-xl border-2 transition-all min-w-[100px] ${selectedDate === d.value ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                      >
                         <span className="text-xs uppercase font-bold opacity-60 mb-1">{d.dayStr}</span>
                         <span className="text-lg font-black">{d.label}</span>
                      </button>
                    ))}
                  </div>
               </div>

               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">Select Time Slot</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-4 rounded-xl border transition-all font-bold text-sm ${selectedSlot === slot ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* STEP 2: ADDRESS */}
          {currentStep === 2 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <MapPin className="h-6 w-6 text-primary" /> Service Location
               </h1>

               {/* Google Maps Fake UI */}
               <div className="w-full h-64 bg-gray-200 rounded-2xl mb-8 relative overflow-hidden border border-gray-300 shadow-inner">
                  {/* Map Graphic Mock */}
                  <img src="https://images.unsplash.com/photo-1524661135-423588f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  
                  {/* Map Pin */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <button 
                      onClick={handleDetectLocation}
                      disabled={isFindingLocation}
                      className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-bold whitespace-nowrap mb-2 hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
                    >
                      {isFindingLocation ? 'Locating...' : 'Use My Current Location'}
                    </button>
                    {!isFindingLocation && <Map className="h-10 w-10 text-primary drop-shadow-md animate-bounce" />}
                  </div>
               </div>

               <h3 className="font-bold text-lg mb-4 text-gray-800">Saved Addresses</h3>
               <div className="space-y-4 mb-6">
                 {addresses.map((addr) => (
                   <label key={addr.id} className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                     <div className="mt-1">
                        <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded uppercase">{addr.type}</span>
                           <span className="font-bold text-gray-900">{addr.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{addr.address}</p>
                     </div>
                   </label>
                 ))}
               </div>

               <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl font-bold text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                 + Add New Address
               </button>
             </div>
          )}

          {/* STEP 3: SUMMARY */}
          {currentStep === 3 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
               <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 Checkout Summary
               </h1>

               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                     <div className="bg-primary/10 p-3 rounded-lg"><Clock className="h-6 w-6 text-primary" /></div>
                     <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase">Schedule</h3>
                        <p className="font-bold text-gray-900">{selectedDate} • {selectedSlot}</p>
                     </div>
                  </div>
                  <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                     <div className="bg-primary/10 p-3 rounded-lg"><MapPin className="h-6 w-6 text-primary" /></div>
                     <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase">Service Location</h3>
                        <p className="font-bold text-gray-900">{addresses.find(a => a.id === selectedAddress)?.type}</p>
                        <p className="text-sm text-gray-600 truncate max-w-sm">{addresses.find(a => a.id === selectedAddress)?.address}</p>
                     </div>
                  </div>
                  <div className="p-6 bg-gray-50">
                     <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Cart Item</h3>
                     <CartItemCard service={service} />
                  </div>
               </div>
             </div>
          )}

        </div>

        {/* Floating Sidebar Actions */}
        <div className="w-full lg:w-80 flex-shrink-0">
           <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-lg border-b border-gray-100 pb-4 mb-4">Pricing Details</h3>
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-500">Service total</span>
                <span className="font-bold text-gray-800">₹{service.price}</span>
              </div>
              <div className="flex justify-between py-2 text-sm border-b border-gray-100 pb-4">
                <span className="text-gray-500">Taxes & Fees</span>
                <span className="font-bold text-gray-800">₹{(service.price * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-4 text-lg font-black text-gray-900">
                <span>Total Amount</span>
                <span>₹{(service.price * 1.18).toFixed(2)}</span>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button 
                  onClick={handleNext}
                  disabled={(currentStep === 1 && (!selectedDate || !selectedSlot)) || (currentStep === 2 && selectedAddress === null)}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    ((currentStep === 1 && (!selectedDate || !selectedSlot)) || (currentStep === 2 && selectedAddress === null)) 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
                  }`}
                >
                  {currentStep === steps.length - 1 ? 'Proceed to Payment' : 'Continue'} <ArrowRight className="h-5 w-5" />
                </button>
                
                {currentStep > 0 && (
                  <button 
                    onClick={handleBack}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" /> Back
                  </button>
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
