import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase/firebase';
import { handleFirestoreError, OperationType } from '../services/firebase/firestoreErrors';
import { UserProfile } from '../types/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUserProfileData: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync / create user profile document in Firestore
  const syncUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
    const userDocPath = `users/${firebaseUser.uid}`;
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const profile = snapshot.data() as UserProfile;
        setUserProfile(profile);
        return profile;
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Career Architect',
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tier: 'pro'
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
        return newProfile;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, userDocPath);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await syncUserProfile(currentUser);
        } catch (err) {
          console.error('Error synchronizing user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
      }
    } catch (error: any) {
      console.error('Google Sign-in failed:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await syncUserProfile(result.user);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      if (name) {
        try {
          await updateProfile(result.user, { displayName: name });
        } catch (e) {
          console.warn('Could not update display name:', e);
        }
      }
      await syncUserProfile(result.user);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      await syncUserProfile(auth.currentUser);
    }
  };

  const updateUserProfileData = async (updates: Partial<UserProfile>) => {
    if (!auth.currentUser) {
      throw new Error('No authenticated user session found.');
    }

    const previousProfile = userProfile;
    const uid = auth.currentUser.uid;
    const userDocPath = `users/${uid}`;

    // Optimistic update
    const merged: UserProfile = {
      ...(previousProfile || {
        uid,
        email: auth.currentUser.email || '',
        displayName: auth.currentUser.displayName || '',
        createdAt: new Date().toISOString(),
        tier: 'pro' as const,
      }),
      ...updates,
      updatedAt: new Date().toISOString()
    };
    setUserProfile(merged);

    try {
      // 1. If displayName or photoURL are updated, keep Firebase Auth user profile in sync
      if (updates.displayName !== undefined || updates.photoURL !== undefined) {
        await updateProfile(auth.currentUser, {
          ...(updates.displayName !== undefined ? { displayName: updates.displayName } : {}),
          ...(updates.photoURL !== undefined ? { photoURL: updates.photoURL } : {})
        });
        // trigger reload to update auth.currentUser properties
        setUser({ ...auth.currentUser });
      }

      // 2. Persist to Firestore
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, merged, { merge: true });
    } catch (error) {
      // Rollback optimistic update
      setUserProfile(previousProfile);
      handleFirestoreError(error, OperationType.WRITE, userDocPath);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      refreshProfile,
      updateUserProfileData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
