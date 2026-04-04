import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { categories, services } from "../utils/data";
import { Star, Clock, Filter } from "lucide-react";

export default function Services() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(s => s.categoryId === selectedCategory);

  return (
    <div className="flex-grow bg-slate-50 min-h-screen pb-16">
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">All Services</h1>
          <p className="text-primary-100 max-w-2xl">Find the perfect professional for your home needs. Browse our verified array of services below.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filter */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-4">
              <Filter className="h-5 w-5" /> Filters
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedCategory === 'all' ? 'Showing All Services' : `Showing results for ${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <span className="text-sm text-gray-500 font-medium">{filteredServices.length} Results</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServices.map(service => (
              <div key={service.serviceId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      <Star className="h-3 w-3 fill-current" /> {service.rating}
                    </div>
                  </div>
                  <div className="text-xs text-primary font-bold mb-4 uppercase tracking-wider">
                    {categories.find(c => c.id === service.categoryId)?.name}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{service.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-700 mt-auto">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-gray-400" /> {service.duration}</span>
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md text-lg font-bold">₹{service.price}</span>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-50 bg-gray-50">
                  <Link to={`/booking?serviceId=${service.serviceId}`} className="block w-full py-2.5 text-center bg-primary text-white font-bold rounded-lg hover:bg-primary-dark hover:shadow-lg transition-all focus:ring-4 focus:ring-primary/20">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg">No services found for this category.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
