import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  googleLoginUser,
} from "../api/authApi";

import { getProfile } from "../api/userApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CLEAR AUTH DATA
  // ==========================================

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setUser(null);

    console.log("=================================");
    console.log("AUTH DATA CLEARED");
    console.log("TOKEN:", localStorage.getItem("token"));
    console.log("USER:", localStorage.getItem("user"));
    console.log("=================================");
  };

  // ==========================================
  // SAVE USER DATA
  // ==========================================

  const saveUserData = (userData) => {
    if (!userData) return;

    setUser(userData);

    // Save complete user
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    if (userData.username) {
      localStorage.setItem(
        "username",
        userData.username
      );
    }

    if (userData.name) {
      localStorage.setItem(
        "name",
        userData.name
      );
    }

    if (userData.email) {
      localStorage.setItem(
        "email",
        userData.email
      );
    }

    console.log("=================================");
    console.log("USER SAVED");
    console.log("USER ID:", userData._id);
    console.log("USERNAME:", userData.username);
    console.log("EMAIL:", userData.email);
    console.log("=================================");
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (data) => {
    try {
      console.log("=================================");
      console.log("LOGIN STARTED");
      console.log("EMAIL:", data.email);
      console.log("=================================");

      // IMPORTANT:
      // Remove old authentication before new login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");

      setUser(null);

      // Login API
      const res = await loginUser(data);

      console.log("LOGIN RESPONSE:", res.data);

      // Check token
      if (!res.data?.token) {
        throw new Error(
          "Login successful but JWT token was not returned"
        );
      }

      const newToken = res.data.token;

      console.log("NEW TOKEN RECEIVED:", !!newToken);

      // Save NEW JWT
      localStorage.setItem(
        "token",
        newToken
      );

      console.log(
        "TOKEN SAVED:",
        !!localStorage.getItem("token")
      );

      // ==========================================
      // GET PROFILE USING NEW TOKEN
      // ==========================================

      const profile = await getProfile();

      console.log(
        "PROFILE RESPONSE:",
        profile.data
      );

      if (!profile.data?.user) {
        throw new Error(
          "Login succeeded but user profile was not returned"
        );
      }

      const userData = profile.data.user;

      // Save new user
      saveUserData(userData);

      console.log("=================================");
      console.log("LOGIN COMPLETE");
      console.log("USER ID:", userData._id);
      console.log("EMAIL:", userData.email);
      console.log("=================================");

      return {
        ...res.data,
        user: userData,
      };

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      // If login failed, don't keep bad/old auth data
      localStorage.removeItem("token");

      throw error;
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);

      console.log(
        "REGISTER RESPONSE:",
        response.data
      );

      return response.data;

    } catch (error) {
      console.error(
        "Register error:",
        error
      );

      throw error;
    }
  };

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const googleLogin = async (credential) => {
    try {
      console.log("=================================");
      console.log("GOOGLE LOGIN STARTED");
      console.log("=================================");

      // Remove previous authentication
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");

      setUser(null);

      // Send Google credential
      const response =
        await googleLoginUser(credential);

      console.log(
        "GOOGLE LOGIN RESPONSE:",
        response.data
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
          "Google login failed"
        );
      }

      const {
        token,
        user,
      } = response.data;

      if (!token) {
        throw new Error(
          "Google login succeeded but no JWT token was returned"
        );
      }

      // Save NEW Google JWT
      localStorage.setItem(
        "token",
        token
      );

      console.log(
        "GOOGLE TOKEN SAVED:",
        !!localStorage.getItem("token")
      );

      // Save user
      if (user) {
        saveUserData(user);
      }

      console.log("=================================");
      console.log("GOOGLE LOGIN COMPLETE");
      console.log("USER ID:", user?._id);
      console.log("EMAIL:", user?.email);
      console.log("=================================");

      return response.data;

    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      localStorage.removeItem("token");

      throw error;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    console.log("=================================");
    console.log("LOGOUT");
    console.log("=================================");

    clearAuthData();
  };

  // ==========================================
  // LOAD USER WHEN PAGE REFRESHES
  // ==========================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token =
          localStorage.getItem("token");

        console.log("=================================");
        console.log("CHECKING EXISTING SESSION");
        console.log(
          "TOKEN EXISTS:",
          !!token
        );
        console.log("=================================");

        if (!token) {
          setLoading(false);
          return;
        }

        // Get profile using current JWT
        const res = await getProfile();

        console.log(
          "PROFILE ON REFRESH:",
          res.data
        );

        if (!res.data?.user) {
          throw new Error(
            "Invalid profile response"
          );
        }

        const userData =
          res.data.user;

        saveUserData(userData);

      } catch (error) {
        console.error(
          "Load user error:",
          error
        );

        clearAuthData();

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