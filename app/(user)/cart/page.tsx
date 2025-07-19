"use client";
import { useCart } from "@/components/CartContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Plus, Minus, ShoppingCart, Package } from "lucide-react";

interface CartItem {
  image: string | undefined;
  id: string;
  name: string;
  price: number;
  quantity: number;
  areaOfUse: string;
  company: string;
  type: string;
}

const CartPage = () => {
  const { cart, setCart, loading, clearCartItem } = useCart();
console.log(cart)
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCart((prev) =>
      prev.map((item) => {
        return item.id === id ? { ...item, quantity: newQuantity } : item;
      })
    );
  };

  const handleCheckout = async () => {
    if (!cart.length) return alert("Your cart is empty");
    console.log(cart);
    const res = await fetch("/api/checkout_session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });

    const { url, isredirect } = await res.json();
    console.log(url, isredirect);
    if (isredirect) {
      redirect(url);
    }
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    clearCartItem(id);
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateSubtotal = () => calculateTotal();
  const shippingCost = 0;
  const totalAmount = calculateSubtotal() + shippingCost;

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Skeleton className="w-full sm:w-40 h-40 rounded-lg" />
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-8 w-1/2" />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
                        <Skeleton className="h-6 w-20" />
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-6 w-8" />
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-1">
              <Card className="p-6">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-px w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full mt-6" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>

        </div>

        {cart.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl mb-2">Your cart is empty</CardTitle>
              <p className="text-muted-foreground">
                Add some items to get started with your shopping.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="w-full sm:w-40 h-40 flex-shrink-0 overflow-hidden rounded-lg ">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col h-full justify-between">
                          <div className="mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">
                                ₹{item.price.toFixed(2)} each
                              </Badge>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-primary">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-destructive cursor-pointer hover:text-destructive hover:bg-destructive/10 self-start"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="h-10 w-10 rounded-full"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Badge
                                variant="outline"
                                className="px-3 py-1 text-base font-semibold"
                              >
                                {item.quantity}
                              </Badge>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="h-10 w-10 rounded-full"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      ₹{calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Free shipping on all orders • Secure checkout
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
