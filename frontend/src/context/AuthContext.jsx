import { useEffect, useMemo, useState } from "react";
import { getSession, login as loginAction, logout as logoutAction } from "../lib/api";
import { AuthContext } from "./AuthContextInstance";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSession()
      .then((response) => {
        if (response?.session) {
          setUser(response.session);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const signIn = async (name) => {
    const result = await loginAction(name);
    if (result?.user) {
      setUser(result.user);
    }
    return result;
  };

  const signOut = async () => {
    await logoutAction().catch(() => {});
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      signIn,
      signOut,
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
