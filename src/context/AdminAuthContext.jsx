import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../firebase/auth.js';
import { AUTHORIZED_ADMIN_EMAIL } from '../firebase/adminService.js';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      // Prompt user to select account
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      
      const email = result.user?.email?.toLowerCase() || '';
      if (email !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        setAuthError(`Access denied: You signed in as ${result.user?.email}. Only ${AUTHORIZED_ADMIN_EMAIL} is authorized to access the clinic admin panel.`);
      }
      return result.user;
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Failed to sign in with Google');
      }
      throw err;
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  const isAuthorizedAdmin = !!(
    currentUser && 
    currentUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
  );

  return (
    <AdminAuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        isAuthorizedAdmin,
        loginWithGoogle,
        logoutAdmin,
        setAuthError
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
