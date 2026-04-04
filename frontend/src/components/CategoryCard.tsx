import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { type Category } from "../utils/data";

const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (Icons as any)[name];
  return Icon ? <Icon className={className} /> : null;
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/services?category=${category.id}`} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all flex flex-col items-center text-center group">
      <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <IconComponent name={category.icon} className="h-8 w-8" />
      </div>
      <h3 className="font-semibold text-gray-800 text-sm">{category.name}</h3>
    </Link>
  );
}
