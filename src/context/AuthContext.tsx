import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  handleFirestoreError,
  OperationType,
  type FirebaseUser
} from '../lib/firebase';
import type { UserProfile } from '../types/threat';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
  incrementUserScanCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const mapAuthError = (err: unknown): string => {
    if (!err || typeof err !== 'object') return 'An unexpected authentication error occurred.';
    const anyErr = err as { code?: string; message?: string };
    const code = anyErr.code || '';
    switch (code) {
      case 'auth/unauthorized-domain':
        return 'Firebase Authentication error: This domain is not authorized in your Firebase console (auth/unauthorized-domain). Please add this URL hostname to "Authorized domains" under Firebase Console > Authentication > Settings, or use Email/Password sign-in.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please verify your credentials.';
      case 'auth/email-already-in-use':
        return 'This email address is already registered. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please provide a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In popup was closed before completing verification.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Access temporarily restricted. Try again later.';
      default:
        return anyErr.message || 'Authentication failed. Please try again.';
    }
  };

  const syncUserProfile = async (user: FirebaseUser) => {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(userDocRef);
      const now = new Date().toISOString();
      if (snap.exists()) {
        const existing = snap.data() as UserProfile;
        const updated: UserProfile = {
          ...existing,
          lastLoginAt: now,
          displayName: user.displayName || existing.displayName || user.email?.split('@')[0] || 'Security Analyst',
          photoURL: user.photoURL || existing.photoURL || '',
        };
        await setDoc(userDocRef, updated, { merge: true });
        setUserProfile(updated);
      } else {
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Security Analyst',
          photoURL: user.photoURL || '',
          createdAt: now,
          lastLoginAt: now,
          totalScans: 0,
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Could not sync user profile in Firestore (offline or rules restricted):', err);
      // Fallback local profile representation
      setUserProfile({
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Security Analyst',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        totalScans: 0,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      startTransition(() => {
        setCurrentUser(user);
      });
      if (user) {
        await syncUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await syncUserProfile(res.user);
      }
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (res.user) {
        await syncUserProfile(res.user);
      }
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  };

  const signupWithEmail = async (email: string, pass: string, displayName?: string) => {
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (res.user) {
        const now = new Date().toISOString();
        const profile: UserProfile = {
          id: res.user.uid,
          email: res.user.email || email.trim(),
          displayName: displayName?.trim() || email.split('@')[0],
          photoURL: '',
          createdAt: now,
          lastLoginAt: now,
          totalScans: 0,
        };
        try {
          await setDoc(doc(db, 'users', res.user.uid), profile);
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.CREATE, `users/${res.user.uid}`);
        }
        setUserProfile(profile);
      }
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      setAuthError(mapAuthError(err));
      throw err;
    }
  };

  const incrementUserScanCount = async () => {
    if (!currentUser) return;
    try {
      const currentCount = (userProfile?.totalScans || 0) + 1;
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { totalScans: currentCount }, { merge: true });
      setUserProfile(prev => prev ? { ...prev, totalScans: currentCount } : null);
    } catch (e) {
      console.warn('Failed to increment scan count in Firestore:', e);
      setUserProfile(prev => prev ? { ...prev, totalScans: (prev.totalScans || 0) + 1 } : null);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        authError,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        logout,
        clearAuthError,
        incrementUserScanCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
