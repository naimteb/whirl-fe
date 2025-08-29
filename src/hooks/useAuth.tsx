import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
  setCurrentUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        setUser(JSON.parse(currentUser));
      }
    } catch (error) {
      console.error('Error loading user session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const setCurrentUser = (nextUser: User | null) => {
    try {
      if (nextUser) {
        localStorage.setItem('currentUser', JSON.stringify(nextUser));
      } else {
        localStorage.removeItem('currentUser');
      }
      setUser(nextUser);
    } catch (e) {
      console.error('Failed to persist currentUser', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};