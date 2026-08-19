import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { loginUser, registerUser, googleLoginUser,} from "../api/authApi";
import { getProfile } from "../api/userApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // SAVE USER DATA
  // ==========================================

  const saveUserData = (userData) => {
    if (!userData) return;

    setUser(userData);

    // Save username
    if (userData.username) {
      localStorage.setItem("username", userData.username);
    }

    // Save name if available
    if (userData.name) {
      localStorage.setItem("name", userData.name);
    }

    // Save email if available
    if (userData.email) {
      localStorage.setItem("email", userData.email);
    }

    console.log("User saved:", userData);
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (data) => {
    try {
      const res = await loginUser(data);

      console.log("LOGIN RESPONSE:", res.data);

      // Save JWT token
      localStorage.setItem("token", res.data.token);

      // Get complete profile
      const profile = await getProfile();

      console.log("PROFILE RESPONSE:", profile.data);

      const userData = profile.data.user;

      // Save user in state + localStorage
      saveUserData(userData);

      return {
      ...res.data,
      user: userData,
    };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);

      console.log("REGISTER RESPONSE:", response.data);

      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };
  
  const googleLogin = async (credential) => {
  try {
    const response = await googleLoginUser(credential);

    console.log(
      "GOOGLE LOGIN RESPONSE:",
      response.data
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Google login failed"
      );
    }

    const { token, user } = response.data;

    // Make sure backend returned JWT
    if (!token) {
      throw new Error(
        "Google login succeeded but no JWT token was returned"
      );
    }

    // Save JWT
    localStorage.setItem(
      "token",
      token
    );

    // Save user
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      saveUserData(user);
    }

    console.log(
      "GOOGLE TOKEN SAVED:",
      !!localStorage.getItem("token")
    );

    return response.data;

  } catch (error) {
    console.error(
      "Google login error:",
      error
    );

    throw error;
  }
};
  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setUser(null);
  };

  // ==========================================
  // LOAD USER WHEN PAGE REFRESHES
  // ==========================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("Token exists:", !!token);

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await getProfile();

        console.log("PROFILE ON REFRESH:", res.data);

        const userData = res.data.user;

        // Restore user
        saveUserData(userData);
      } catch (error) {
        console.error("Load user error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        localStorage.removeItem("email");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        googleLogin,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// useAuth HOOK
// ==========================================

export const useAuth = () => {
  return useContext(AuthContext);
};