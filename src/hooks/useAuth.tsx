import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => void;
  setCurrentUser: (user: User | null) => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: auth0User, isAuthenticated: auth0IsAuthenticated, isLoading: auth0IsLoading, logout } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Transform Auth0 user to our User interface
  useEffect(() => {
    if (auth0User && auth0IsAuthenticated) {
      const transformedUser: User = {
        id: auth0User.sub || auth0User.email || Date.now().toString(),
        email: auth0User.email || '',
        name: auth0User.name || auth0User.email || '',
        createdAt: auth0User.updated_at || new Date().toISOString(),
      };
      setUser(transformedUser);
    } else {
      setUser(null);
    }
    setIsLoading(auth0IsLoading);
  }, [auth0User, auth0IsAuthenticated, auth0IsLoading]);

  const signOut = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    setUser(null);
  };

  const setCurrentUser = (nextUser: User | null) => {
    // This is mainly for compatibility, but Auth0 manages the user state
    setUser(nextUser);
  };

  const refreshAuth = () => {
    // Auth0 handles refresh automatically, but we can trigger a re-evaluation
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 100);
  };

  const isAuthenticated = !!user && !!user.id;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated,
      signOut, 
      setCurrentUser,
      refreshAuth 
    }}>
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