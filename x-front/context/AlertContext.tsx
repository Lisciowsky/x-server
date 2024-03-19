import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Adjust the import path as needed
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Extending the AlertContextType to include alertState
interface AlertContextType {
  showAlert: (message: string, title?: string, variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info') => void;
  hideAlert: () => void;
  alertState: {
    isVisible: boolean;
    message: string;
    title: string;
    variant: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  };
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState({
    isVisible: false,
    message: '',
    title: '',
    variant: 'default',
  });

  const showAlert = useCallback((message: string, title: string = '', variant: 'default' | 'destructive' | 'success' | 'warning' | 'info' = 'default') => {
    setAlertState({ isVisible: true, message, title, variant });
    // Optionally, set a timeout to automatically hide the alert after a certain duration
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prevState => ({ ...prevState, isVisible: false }));
  }, []);

  // Including alertState in the context provider's value
  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alertState }}>
      {children}
    </AlertContext.Provider>
  );
};
