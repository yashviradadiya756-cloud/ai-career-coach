import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";
import { getProfile } from "../api/userApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = async (data) => {
    const res = await loginUser(data);

    localStorage.setItem("token", res.data.token);

    const profile = await getProfile();

    setUser(profile.data.user);
  };

  // Register
  const register = async (userData) => {
  const response = await api.post(
    "/api/auth/register",
    userData
  );

  return response.data;
};

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Load User
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await getProfile();

        setUser(res.data.user);
      } catch (error) {
        console.log(error);

        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);