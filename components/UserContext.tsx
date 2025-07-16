"use client";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type UserType = {
  id: string;
  clerkId: string;
};

type UserContextType = {
  user: UserType | null;
  loading: boolean;
  error: string | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const u = useUser();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (u) {
          const res = await fetch("/api/user");
          if (!res.ok) console.log("Error fetching user");
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useuser = () => {
  const user = useContext(UserContext);
  return user;
};
