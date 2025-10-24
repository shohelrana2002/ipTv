/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import app from "./../Firebase/firebase.config";
import axios from "axios";

export const auth = getAuth(app);
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); // ✅ initial loading
  const [user, setUser] = useState(null);

  // Sign Up
  const handleSignUp = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign In
  const handleSignIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Update User Profile
  const handleUpdateUser = (user, updateData) =>
    updateProfile(user, updateData);

  // Send Email Verification
  const handleSendEmailVerification = () => {
    if (auth.currentUser) {
      setLoading(true);
      return sendEmailVerification(auth.currentUser);
    }
    return Promise.reject(new Error("No current user"));
  };

  // Sign Out
  const handleSignOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Reset Password
  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  // Google Sign-In
  const provider = new GoogleAuthProvider();
  const handleGoogle = () => signInWithPopup(auth, provider);

  // Listen Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        setLoading(true);
        try {
          // Fetch JWT from backend
          const { data } = await axios.post(
            "https://ip-backend-five.vercel.app/jwt",
            {
              email: currentUser.email,
            }
          );
          localStorage.setItem("access-token", data.token);
        } catch (err) {
          console.error("JWT fetch error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        localStorage.removeItem("access-token");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const info = {
    user,
    loading,
    setLoading,
    handleSignUp,
    handleGoogle,
    handleSignIn,
    handleSignOut,
    handleUpdateUser,
    handleSendEmailVerification,
    resetPassword,
  };

  return <AuthContext.Provider value={info}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
