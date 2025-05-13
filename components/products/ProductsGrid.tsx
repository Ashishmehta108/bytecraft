"use client";
import { useState } from "react";
import { Product } from "@prisma/client";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Eye,
  Star,
  Heart,
  Tag,
  ArrowRight,
  Check,
} from "lucide-react";
import FavoriteToggleButton from "./FavoriteToggleButton";

function ProductsGrid({ products }: { products: Product[] }) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const handleAddToCart = (productId: string) => {
    setAddedToCart({ ...addedToCart, [productId]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [productId]: false });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
      {products.map((product) => {
        const { id: productId, name, price, image } = product;
        const amount = formatCurrency(price);
        const isHovered = hoveredProduct === productId;
        const isInCart = addedToCart[productId];

        // Mock data for enhanced UI
        const discount = Math.floor(Math.random() * 30) + 10; // Random discount between 10-40%
        const oldPrice = price * (1 + discount / 100);
        const formattedOldPrice = formatCurrency(oldPrice);
        const rating = 4.5;
        const reviewCount = Math.floor(Math.random() * 100) + 5;
        const categories = ["Furniture", "Home", "Modern"];
        const hasDiscount = Math.random() > 0.5;
        const isNew = Math.random() > 0.7;
        const isBestseller = Math.random() > 0.8;

        return (
          <article
            key={productId}
            className="group relative transform transition-all duration-300"
          >
            <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 group-hover:duration-200"></div>
            <Card className="relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl bg-white rounded-xl">
              <CardContent className="p-0">
                <div className="absolute z-10 top-4 right-4">
                  <FavoriteToggleButton productId={productId} />
                </div>

                <div className="relative w-full h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <div className="absolute inset-0 opacity-10 pattern-dots pattern-gray-700 pattern-bg-transparent pattern-size-2"></div>
                  <Link href={`/products/${productId}`}>
                    <div className="relative w-full h-full transition-all duration-500 ease-out group-hover:scale-110">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        className="object-contain p-6 filter drop-shadow-md"
                      />
                    </div>
                  </Link>

                  {/* Quick Action Buttons - Appear on Hover */}
                  <div
                    className={`absolute bottom-0 inset-x-0 flex justify-center gap-3 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${
                      isHovered
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <Link
                      href={`/products/${productId}`}
                      className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-all hover:scale-110 shadow-lg"
                      aria-label="View product details"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => handleAddToCart(productId)}
                      disabled={isInCart}
                      className={`
                        p-3 rounded-full shadow-lg transition-all hover:scale-110 relative overflow-hidden
                        ${
                          isInCart
                            ? "bg-green-500 text-white"
                            : "bg-black text-white hover:bg-gray-800"
                        }
                      `}
                      aria-label="Add to cart"
                    >
                      {isInCart ? (
                        <Check size={18} />
                      ) : (
                        <ShoppingCart size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Details with Glass Effect */}
                <div className="p-6 backdrop-blur-sm bg-white/95">
                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* Product Name */}
                  <Link href={`/products/${productId}`}>
                    <h2 className="text-xl font-medium text-gray-900 capitalize line-clamp-1 hover:text-blue-600 transition-colors">
                      {name}
                    </h2>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={
                            i < Math.floor(rating) ? "currentColor" : "none"
                          }
                          stroke={
                            i < Math.floor(rating) ? "none" : "currentColor"
                          }
                          className={
                            i < Math.floor(rating) ? "" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {rating} ({reviewCount} reviews)
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    {/* Price with Discount */}
                    <div className="flex items-baseline">
                      <p className="text-xl font-bold text-gray-900">
                        {amount}
                      </p>
                      {hasDiscount && (
                        <p className="ml-2 text-sm text-gray-500 line-through">
                          {formattedOldPrice}
                        </p>
                      )}
                    </div>

                    {/* Stock Status with Animated Pulse */}
                    <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700">
                        In Stock
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/products/${productId}`}
                    className="mt-4 flex items-center justify-center w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors group"
                  >
                    View Details
                    <ArrowRight
                      size={16}
                      className="ml-1 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </article>
        );
      })}
    </div>
  );
}

export default ProductsGrid;
