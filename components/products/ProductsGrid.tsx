"use client";

import { useState, useCallback, memo, useEffect } from "react";
import { Product } from "@prisma/client";
import { formatCurrency } from "@/utils/format";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { useCart } from "../CartContext";
import { useFavorite } from "../FavoriteContext";
import { CartItem } from "../CartContext";
import { Button } from "../ui/button";

interface ProductsGridProps {
  products: Product[];
  className?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  isInCart: boolean;
  isFavorited: boolean;
}

const ProductCard = memo<ProductCardProps>(
  ({ product, onAddToCart, onToggleFavorite, isInCart, isFavorited }) => {
    const { id: productId, name, price, image } = product;
    const amount = formatCurrency(price);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) {
      return (
        <div className="bg-white border border-neutral-200 dark:bg-neutral-800 dark:bg-neutral-950 rounded-xl shadow-sm p-4">
          <div className="animate-pulse">
            <div className="h-48 bg-neutral-200  dark:bg-neutral-900 rounded-lg mb-4"></div>
            <div className="h-6 bg-neutral-200 dark:bg-neutral-900  rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-neutral-200 dark:bg-neutral-900  rounded w-1/2 mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-900  rounded w-1/3"></div>
              <div className="h-8 bg-neutral-200 dark:bg-neutral-900  rounded w-8"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group relative bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800  rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-square bg-neutral-50 border-neutral-200 dark:bg-neutral-950 overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(productId)}
            className="absolute top-3 right-3 z-10 h-8 w-8 p-0 bg-white/90 dark:bg-neutral-900 backdrop-blur-sm rounded-full shadow-sm hover:bg-white  transition-all hover:cursor-pointer  text-neutral-400 dark:text-neutral-300 hover:text-red-400   dark:hover:text-red-400 duration-200"
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              size={14}
              className={`transition-colors duration-200 ${
                isFavorited
                  ? "text-red-500 fill-red-500 "
                  : " hover:cursor-pointer  hover:text-red-400"
              }`}
            />
          </Button>

          <Link href={`/products/${productId}`} className="block h-full">
            <div className="relative h-full transition-transform duration-300">
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover p-4"
                priority={false}
                loading="lazy"
              />
            </div>
          </Link>
        </div>

        <div className="p-4 space-y-1">
          <Link href={`/products/${productId}`} className="block">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-200 line-clamp-2 leading-relaxed hover:text-gray-700 transition-colors">
              {name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-300">
              {amount}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddToCart(productId)}
              className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
                isInCart
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-100 cursor-pointer hover:bg-neutral-200 "
              }`}
              aria-label={isInCart ? "Added to cart" : "Add to cart"}
            >
              {isInCart ? (
                <Check size={14} className="text-white " />
              ) : (
                <ShoppingCart size={14} />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

function ProductsGrid({ products, className = "" }: ProductsGridProps) {
  const cart = useCart();
  const favorite = useFavorite();

  const handleAddToCart = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      console.log(product);
      const p = {
        image: product?.image!,
        id: product?.id!,
      };
      if (product && !cart.cart.find((item) => item.id === productId)) {
        cart.setCart((prev) => [...prev, p as CartItem]);
      }
    },
    [products, cart]
  );

  const isInCart = useCallback(
    (id: string): boolean => {
      return Boolean(cart.cart.find((item) => item.id === id));
    },
    [cart.cart]
  );

  const isFavorited = useCallback(
    (id: string): boolean => {
      return favorite.favorite.includes(id);
    },
    [favorite.favorite]
  );

  const toggleFavorite = useCallback(
    (productId: string) => {
      if (favorite.favorite.includes(productId)) {
        favorite.removefavorite(productId);
      } else {
        favorite.addfavorite(productId);
      }
    },
    [favorite]
  );

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-400 mb-4">
          <ShoppingCart size={48} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 ${className}`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onToggleFavorite={toggleFavorite}
          isInCart={isInCart(product.id)}
          isFavorited={isFavorited(product.id)}
        />
      ))}
    </div>
  );
}

export default ProductsGrid;
