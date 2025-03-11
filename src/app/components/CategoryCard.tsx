import Link from "next/link";
import { Category } from "@prisma/client";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>
    </Link>
  );
} 