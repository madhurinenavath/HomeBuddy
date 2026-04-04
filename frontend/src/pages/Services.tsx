import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, services } from "../utils/data";
import { Filter } from "lucide-react";
import { ServiceCard } from "../components/ServiceCard";
import { SearchBar } from "../components/SearchBar";

export default function Services() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  // Filtering states
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  // Applying Filters
  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === "all" || s.categoryId === selectedCategory;
    const matchesQuery = initialQuery === "" || 
                         s.name.toLowerCase().includes(initialQuery.toLowerCase()) || 
                         s.description.toLowerCase().includes(initialQuery.toLowerCase());
    const matchesRating = s.rating >= minRating;
    const matchesPrice = s.price <= maxPrice;
    
    return matchesCategory && matchesQuery && matchesRating && matchesPrice;
  });

  return (
    <div className="flex-grow bg-slate-50 min-h-screen pb-16">
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">All Services</h1>
          <p className="text-primary-100 max-w-2xl mb-8">Find the perfect professional for your home needs. Browse our verified array of services below.</p>
          
          <div className="max-w-2xl">
            <SearchBar placeholder="Search by service name or description..." inputClassName="rounded-xl bg-white/10 text-white placeholder-primary-200 border border-white/20 focus:bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filter */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b pb-4 border-gray-100">
              <Filter className="h-5 w-5" /> Filters
            </h3>
            
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Categories</h4>
                <div className="space-y-1">
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Min Rating</h4>
                <input 
                  type="range" 
                  min="0" max="5" step="0.5" 
                  value={minRating} 
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 font-bold">
                  <span>{minRating} Stars</span>
                  <span>5 Stars</span>
                </div>
              </div>

              {/* Price Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Max Price: ₹{maxPrice}</h4>
                <input 
                  type="range" 
                  min="0" max="5000" step="100" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800">
              {initialQuery ? (
                <>Search: <span className="text-primary">"{initialQuery}"</span></>
              ) : selectedCategory === 'all' ? 'Showing All Services' : `Showing results for ${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <span className="text-sm text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">{filteredServices.length} Results</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredServices.map(service => (
              <ServiceCard key={service.serviceId} service={service} showCategory={selectedCategory === 'all'} />
            ))}

            {filteredServices.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-bold text-gray-800">No services found.</p>
                <p className="text-sm">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
