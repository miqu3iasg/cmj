import type User from "@/types/user";
import { useSession } from "next-auth/react";

type UseAuthReturn = {
  user: User; 
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (data: User) => Promise<void>;
};

export const useAuth = (): UseAuthReturn => {
  const { data: session, status, update: updateSession } = useSession();

  const user: User = {
    id: "", // Provide a default or fetched value
    name: session?.user?.name || null,
    email: session?.user?.email || null,
    image: session?.user?.image || null,
    emailVerified: null, // Provide a default or fetched value
    createdAt: new Date(), // Provide a default or fetched value
    updatedAt: new Date(), // Provide a default or fetched value
    role: "user", // Provide a default or fetched value
    isActive: true, // Provide a default or fetched value
    isDeleted: false, // Provide a default or fetched value
    password: "", // Provide a default or fetched value
  };
  const isAuthenticated = !!user;
  const isLoading = status === "loading";

  const updateUser = async (data: User) => {
    await updateSession(data);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    updateUser,
  };
};
