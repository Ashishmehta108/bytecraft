"use client";

import { debouncePerItem } from "@/utils/debounce";
import { CheckCircle2 } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { toast } from "sonner";

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

type UpdateCartItem = {
  id: string;
  quantity: number;
};

type UserCartContextSchema = {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  addToCart: (item: CartItem) => void;
  changeItemQuantity: (item: UpdateCartItem) => void;
  clearCartItem: (productId: string) => void;
  loading: boolean;
  error: string | null;
  update: boolean;
  setUpdate: Dispatch<SetStateAction<boolean>>;
};

const UserCartContext = createContext<UserCartContextSchema>({
  cart: [],
  setCart: () => {},
  addToCart: () => {},
  changeItemQuantity: () => {},
  clearCartItem: () => {},
  loading: true,
  error: null,
  update: false,
  setUpdate: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [update, setUpdate] = useState(false);

  const prevCartRef = useRef<CartItem[]>([]);
  const hasMounted = useRef(false);

  const addToCart = async (product: CartItem) => {
    try {
      const item = { productId: product.id };
      setLoading(true);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      if (!res.ok) throw new Error("Failed to add item to cart");

      const data = await res.json();
      setCart(data.cart);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to add item to cart.");
    } finally {
      setLoading(false);
    }
  };

  const changeItemQuantity = async (item: UpdateCartItem) => {
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
      });
    } catch (error) {
      toast.error(
        "Couldn't update item quantity. Please refresh and try again."
      );
    }
  };

  const clearCartItem = async (productId: string) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    console.log(await res.json());
    toast(
      <span>
        <CheckCircle2 className="fill-green-500 text-white" /> Cart cleared
      </span>
    );
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCart(data.cart || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      prevCartRef.current = cart;
      return;
    }
    const prevCart = prevCartRef.current;
    const changedItems: UpdateCartItem[] = cart.reduce(
      (acc: UpdateCartItem[], currentItem) => {
        const prevItem = prevCart.find((item) => item.id === currentItem.id);
        if (prevItem && prevItem.quantity !== currentItem.quantity) {
          acc.push({ id: currentItem.id, quantity: currentItem.quantity });
        }
        return acc;
      },
      []
    );

    if (changedItems.length > 0) {
      changedItems.forEach((item) => changeItemQuantity(item));
    }

    prevCartRef.current = cart;
  }, [cart]);

  return (
    <UserCartContext.Provider
      value={{
        cart,
        setCart,
        loading,
        error,
        addToCart,
        clearCartItem,
        changeItemQuantity,
        update,
        setUpdate,
      }}
    >
      {children}
    </UserCartContext.Provider>
  );
};

export const useCart = () => useContext(UserCartContext);
