import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  ready: false,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});
