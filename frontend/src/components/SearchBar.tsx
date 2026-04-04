import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function SearchBar({ placeholder = "Search for services...", className = "", inputClassName = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/services?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate(`/services`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
      <input 
        type="text" 
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-full pl-10 pr-4 py-2 border border-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${inputClassName}`}
      />
      <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
      <button type="submit" className="hidden">Search</button>
    </form>
  );
}
