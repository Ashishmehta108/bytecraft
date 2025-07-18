"use client";

import { CheckCircle2, Plus, Minus, ShoppingCart, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useCart } from "../CartContext";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price?: number;
  image?: string;
  areaOfUse?: string;
  company?: string;
  type?: string;
}
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  areaOfUse: string;
  company: string;
  type: string;
};

interface AddToCartProps {
  product: Product;
}

function AddToCart({ product }: AddToCartProps) {
  const { addToCart, cart, setCart, clearCartItem } = useCart();
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem) {
      setIsInCart(true);
      setQuantity(cartItem.quantity || 1);
    } else {
      setIsInCart(false);
      setQuantity(0);
    }
  }, [cart, product.id]);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      price: product.price ?? 0,
      quantity: 1,
      areaOfUse: product.areaOfUse ?? "",
      company: product.company ?? "",
      type: product.type ?? "",
    });
    toast(
      <span className="flex items-center gap-2">
        <CheckCircle2 className="fill-green-500 text-white" />
        {product.name} added to cart
      </span>
    );
  };

  const handleQuantityChange = (newQuantity: number) => {
    setCart((prev) =>
      prev.map((item) => {
        return item.id === product.id
          ? { ...item, quantity: newQuantity }
          : item;
      })
    );
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    handleQuantityChange(newQuantity);
    toast(
      <span className="flex items-center gap-2">
        <CheckCircle2 className="fill-green-500 text-white" />
        Quantity updated to {newQuantity}
      </span>
    );
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      handleQuantityChange(newQuantity);
      toast(
        <span className="flex items-center gap-2">
          <CheckCircle2 className="fill-red-500 text-white" />
          Quantity updated to {newQuantity}
        </span>
      );
    } else {
      // Remove item from cart
      setCart((prev) => prev.filter((item) => item.id !== product.id));
      clearCartItem(product.id);
      toast(
        <span className="flex items-center gap-2">
          <CheckCircle2 className="fill-red-500 text-white" />
          {product.name} removed from cart
        </span>
      );
    }
  };

  if (isInCart) {
    return (
      <div className="flex items-center gap-4 mt-8">
        <div className="flex items-center gap-2 bg-transparent rounded-none transition-shadow duration-200">
          <Button
            onClick={handleDecrement}
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 rounded-xl hover:bg-zinc-50 dark:bg-zinc-900 bg-zinc-50 dark:hover:bg-zinc-900/20 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all duration-200"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="flex items-center rounded-xl justify-center min-w-[4rem] h-12 px-4 bg-zinc-50 dark:bg-zinc-900 border-x-2   font-semibold text-lg">
            {quantity}
          </div>

          <Button
            onClick={handleIncrement}
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 rounded-xl hover:bg-zinc-50 dark:bg-zinc-900 bg-zinc-50 dark:hover:bg-zinc-900/20 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 px-4 py-2  rounded-full ">
          <CheckCircle2 className="fill-green-500 h-6 w-6 text-white" />
          <span className="text-sm font-medium text-green-700 ">In Cart</span>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      variant={"outline"}
      className="relative mt-8 px-8 py-4 text-lg font-semibold cursor-pointer "
      size="lg"
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      Add to Cart
    </Button>
  );
}

export default AddToCart;
