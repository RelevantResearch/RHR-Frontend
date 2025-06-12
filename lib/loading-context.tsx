'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Handle page reload/refresh loading
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsLoading(true);
      setLoadingMessage('Loading');
    };

    const handleLoad = () => {
      // Simulate a brief loading period for smooth UX
      setTimeout(() => {
        setIsPageLoading(false);
        setIsLoading(false);
      }, 800);
    };

    // Check if page is still loading
    if (document.readyState === 'loading') {
      setIsPageLoading(true);
      setIsLoading(true);
      setLoadingMessage('Loading application...');
    } else {
      // Page already loaded
      setTimeout(() => {
        setIsPageLoading(false);
        setIsLoading(false);
      }, 300);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const showLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const updateLoadingMessage = (message: string) => {
    setLoadingMessage(message);
  };

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading: isLoading || isPageLoading, 
        showLoading, 
        hideLoading, 
        setLoadingMessage: updateLoadingMessage 
      }}
    >
      {children}
      <LoadingOverlay 
        isVisible={isLoading || isPageLoading} 
        message={loadingMessage} 
      />
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};