import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  login as authLogin,
  logout as authLogout,
  getCurrentUser,
  updateCurrentUser,
} from "../../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // CHECK EXISTING SESSION

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser ?? null);
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Session check failed:", error);
          setUser(null);
        }
      } finally {
        setReady(true);
      }
    };

    checkSession();
  }, []);

  // LOGIN

  const login = useCallback(async (username, password) => {
    const loggedUser = await authLogin(username, password);

    setUser(loggedUser);

    return loggedUser;
  }, []);

  // LOGOUT

  const logout = useCallback(async () => {
    try {
      await authLogout();
    } finally {
      setUser(null);
    }
  }, []);
  
    //  Mise à jour du profil
    const updateUser = useCallback(async (payload) => {
    const updatedUser = await updateCurrentUser(payload);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  // CONTEXT VALUE

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: !!user,
      login,
      logout,
      updateUser,
    }),
    [user, ready, login, logout , updateUser,]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
