import { useState } from "react";
import { User, FileText, Settings, Heart, MapPin, Search } from "lucide-react";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { Modal } from "../components/Modal";
import { Timeline, type OrderStage } from "../components/Timeline";

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
    date: "12 Mar 2026",
    amount: "₹588.82",
    professional: "Anita Verma (⭐ 4.9)",
    status: "Completed" as StatusType
  },
  {
    id: "ORD-5544-DF",
    service: "Leakage Repair",
    date: "05 Feb 2026",
    amount: "₹352.82",
    professional: "Rahul Sharma (⭐ 4.8)",
    status: "Cancelled" as StatusType
  }
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderStage, setSelectedOrderStage] = useState<OrderStage>("Requested");

  const openTracking = (stage: OrderStage) => {
    setSelectedOrderStage(stage);
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
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-primary/10 text-primary transition-colors">
                <FileText className="h-5 w-5" /> My Orders
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5" /> Favorites
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <MapPin className="h-5 w-5" /> Saved Addresses
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings className="h-5 w-5" /> Account Settings
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
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
                            onClick={() => openTracking(order.stage)}
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
      </div>

      <Modal isOpen={trackingModalOpen} onClose={() => setTrackingModalOpen(false)} title="Live Order Tracking">
         <Timeline currentStage={selectedOrderStage} />
         <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
            <div className="bg-blue-600 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center font-bold">
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
