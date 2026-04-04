import { useState } from "react";
import { User, FileText, Settings, Heart, MapPin, Search, Plus } from "lucide-react";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { Modal } from "../components/Modal";
import { Timeline, type OrderStage } from "../components/Timeline";
import { services } from "../utils/data";
import { ServiceCard } from "../components/ServiceCard";

// Mock Active and Past Orders
const activeOrders = [
  {
    id: "ORD-9821-XA",
    service: "AC Service & Repair",
    date: "Today, 03:00 PM",
    amount: "₹824.82",
    professional: "Mohammad Ali (⭐ 4.7)",
    status: "In Progress" as StatusType,
    stage: "InProgress" as OrderStage
  },
  {
    id: "ORD-4421-ZB",
    service: "Intense Home Cleaning",
    date: "Tomorrow, 09:00 AM",
    amount: "₹3538.82",
    professional: "Rahul Sharma (⭐ 4.8)",
    status: "Upcoming" as StatusType,
    stage: "Assigned" as OrderStage
  }
];

const pastOrders = [
  {
    id: "ORD-1120-CC",
    service: "Haircut & Styling",
    date: "12 Mar 2026, 11:00 AM",
    amount: "₹588.82",
    professional: "Anita Verma (⭐ 4.9)",
    status: "Completed" as StatusType
  },
  {
    id: "ORD-5544-DF",
    service: "Leakage Repair",
    date: "05 Feb 2026, 01:00 PM",
    amount: "₹352.82",
    professional: "Rahul Sharma (⭐ 4.8)",
    status: "Cancelled" as StatusType
  }
];

export default function Profile() {
  const [activeSection, setActiveSection] = useState<'orders' | 'favorites' | 'addresses' | 'settings'>('orders');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  
  // Tracking Modal State
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderStage, setSelectedOrderStage] = useState<OrderStage>("Requested");
  const [selectedOrderDate, setSelectedOrderDate] = useState<string>("");

  const favoriteServices = services.slice(0, 2); // Taking first 2 as mock favorites

  const openTracking = (stage: OrderStage, date: string) => {
    setSelectedOrderStage(stage);
    setSelectedOrderDate(date);
    setTrackingModalOpen(true);
  };

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden sticky top-24">
            <div className="flex flex-col items-center mb-6 border-b border-gray-100 pb-6">
              <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <h2 className="font-bold text-xl text-gray-900">Demo User</h2>
              <p className="text-gray-500 text-sm mt-1">+91 9876543210</p>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveSection('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeSection === 'orders' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <FileText className="h-5 w-5" /> My Orders
              </button>
              <button 
                onClick={() => setActiveSection('favorites')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeSection === 'favorites' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <Heart className="h-5 w-5" /> Favorites
              </button>
              <button 
                onClick={() => setActiveSection('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeSection === 'addresses' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <MapPin className="h-5 w-5" /> Saved Addresses
              </button>
              <button 
                onClick={() => setActiveSection('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeSection === 'settings' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <Settings className="h-5 w-5" /> Account Settings
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* ORDERS SECTION */}
          {activeSection === 'orders' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex border-b border-gray-100">
                  <button 
                    onClick={() => setActiveTab('active')}
                    className={`flex-1 py-4 font-bold text-sm ${activeTab === 'active' ? 'text-primary border-b-2 border-primary bg-primary/5 rounded-tl-2xl' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                  >
                    Active Bookings ({activeOrders.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-4 font-bold text-sm ${activeTab === 'history' ? 'text-primary border-b-2 border-primary bg-primary/5 rounded-tr-2xl' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                  >
                    Order History
                  </button>
                </div>

                <div className="p-6">
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Search orders by service or ID..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-primary focus:bg-white transition-all text-sm" />
                  </div>

                  <div className="space-y-4">
                    {activeTab === 'active' ? (
                      activeOrders.map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:border-primary/30 transition-colors flex flex-col md:flex-row gap-6 md:items-center">
                           <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{order.service}</h3>
                                <StatusBadge status={order.status} />
                              </div>
                              <div className="text-sm text-gray-500 mb-1">ID: {order.id} • {order.date}</div>
                              <div className="text-sm text-gray-700 font-medium py-2">
                                 Pro: <span className="font-bold">{order.professional}</span>
                              </div>
                           </div>
                           <div className="flex-shrink-0 flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                              <span className="font-black text-xl text-gray-800">{order.amount}</span>
                              <button 
                                onClick={() => openTracking(order.stage, order.date)}
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all text-sm w-full md:w-auto"
                              >
                                Track Order
                              </button>
                           </div>
                        </div>
                      ))
                    ) : (
                       pastOrders.map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row gap-6 md:items-center">
                           <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{order.service}</h3>
                                <StatusBadge status={order.status} />
                              </div>
                              <div className="text-sm text-gray-500 mb-1">ID: {order.id} • {order.date}</div>
                              <div className="text-sm text-gray-700 font-medium py-2">
                                 Pro: <span className="font-bold">{order.professional}</span>
                              </div>
                           </div>
                           <div className="flex-shrink-0 flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                              <span className="font-bold text-lg text-gray-800">{order.amount}</span>
                              {order.status === 'Completed' ? (
                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all text-sm w-full md:w-auto">
                                  Rate Experience
                                </button>
                              ) : null}
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAVORITES SECTION */}
          {activeSection === 'favorites' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Favorites</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {favoriteServices.map(service => (
                   <ServiceCard key={service.serviceId} service={service} showCategory />
                ))}
              </div>
            </div>
          )}

          {/* ADDRESSES SECTION */}
          {activeSection === 'addresses' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
                <button className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-all text-sm">
                  <Plus className="h-4 w-4" /> Add New
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                       <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Home</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2">Demo User</h3>
                    <p className="text-gray-600 text-sm mt-1 mb-4">Flat 4B, Signature Towers, MG Road, Gurgaon, 122002</p>
                    <div className="flex gap-3 mt-auto">
                      <button className="text-sm font-bold text-primary hover:underline">Edit</button>
                      <button className="text-sm font-bold text-red-500 hover:underline">Delete</button>
                    </div>
                 </div>
                 
                 <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                       <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Office</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2">Demo User</h3>
                    <p className="text-gray-600 text-sm mt-1 mb-4">Floor 3, Tech Park, Cyber City, Gurgaon, 122008</p>
                    <div className="flex gap-3 mt-auto">
                      <button className="text-sm font-bold text-primary hover:underline">Edit</button>
                      <button className="text-sm font-bold text-red-500 hover:underline">Delete</button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* SETTINGS SECTION */}
          {activeSection === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                      <input type="text" defaultValue="Demo User" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                      <input type="text" defaultValue="+91 9876543210" disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg outline-none cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                      <input type="email" defaultValue="demo.user@example.com" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary" />
                    </div>
                  </div>
                  <button className="mt-4 bg-primary text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-primary-dark transition-all">Save Changes</button>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">Preferences</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
                    <span className="font-medium text-gray-700">Receive WhatsApp notifications for order updates</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer mt-3">
                    <input type="checkbox" className="w-5 h-5 text-primary rounded" />
                    <span className="font-medium text-gray-700">Receive promotional emails and offers</span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Modal isOpen={trackingModalOpen} onClose={() => setTrackingModalOpen(false)} title="Live Order Tracking">
         <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
           <div>
             <h3 className="font-bold text-gray-900 text-lg">Order Information</h3>
             <p className="text-primary font-bold text-sm mt-1 flex items-center gap-1.5 bg-primary/10 w-fit px-2 py-0.5 rounded uppercase tracking-wider">
               📅 Scheduled for: {selectedOrderDate}
             </p>
           </div>
           <StatusBadge status="In Progress" />
         </div>

         <Timeline currentStage={selectedOrderStage} />
         
         <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
            <div className="bg-blue-600 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center font-bold flex-shrink-0">
               {activeOrders[0]?.professional.charAt(0)}
            </div>
            <div>
               <h4 className="font-bold text-blue-900">Contact Professional</h4>
               <p className="text-sm text-blue-800 mt-1">If you need immediate assistance, call {activeOrders[0]?.professional.split(' ')[0]} at +91 99****6789.</p>
            </div>
         </div>
      </Modal>

    </div>
  );
}
