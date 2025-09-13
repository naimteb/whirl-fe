import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  fallbackPath = '/auth' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({ 
        title: 'Authentication Required', 
        description: 'Please sign in to access this page.',
        variant: "destructive"
      });
      
      // Use Auth0's loginWithRedirect instead of navigating to /auth
      loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, toast]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
