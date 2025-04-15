import User from "@/types/user";
import { useSession } from "next-auth/react";

type UseAuthReturn = {
  user: User | null;
  isAuthenticated: boolean;
  updateUser: (data: User) => Promise<void>;
};

export const useAuth = (): UseAuthReturn => {
  const { data: session, update: updateSession } = useSession();

  const updateUser = async (data: User) => {
    await updateSession(data);
  };

  if (!session || !session.user)
    return {
      user: null,
      isAuthenticated: false,
      updateUser
    };

  const { email, name } = session.user;

  if (!email || !name)
    return {
      user: null,
      isAuthenticated: false,
      updateUser
    };

  const user = new User({
    email,
    fullname: name,
    nickname: "",
    password: "",
    authStatus: "AUTHENTICATED",
  })
  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    updateUser,
  };
};
