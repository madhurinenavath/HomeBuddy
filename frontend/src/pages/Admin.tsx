import { Users, BarChart3, Wrench, Wallet } from "lucide-react";

export default function Admin() {
  return (
    <div className="flex-grow bg-slate-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg"><Users className="h-6 w-6 text-blue-600" /></div>
              <h3 className="font-bold text-gray-600">Total Users</h3>
            </div>
            <div className="text-3xl font-black">12,450</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg"><Wrench className="h-6 w-6 text-purple-600" /></div>
              <h3 className="font-bold text-gray-600">Professionals</h3>
            </div>
            <div className="text-3xl font-black">842</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg"><BarChart3 className="h-6 w-6 text-green-600" /></div>
              <h3 className="font-bold text-gray-600">Bookings (Today)</h3>
            </div>
            <div className="text-3xl font-black">356</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-amber-100 p-3 rounded-lg"><Wallet className="h-6 w-6 text-amber-600" /></div>
              <h3 className="font-bold text-gray-600">Revenue (Today)</h3>
            </div>
            <div className="text-3xl font-black">₹4.2L</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center text-gray-500 py-20">
          <p>Admin features (User Management, Professional Verification, Analytics) will be available once backend APIs are integrated.</p>
        </div>
      </div>
    </div>
  );
}
