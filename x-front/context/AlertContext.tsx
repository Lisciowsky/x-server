import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Adjust the import path as needed
import { Alert} from '@/components/ui/alert';
import { useRef } from 'react';
// Extending the AlertContextType to include alertState
interface Alert {
  id: number;
  message: string;
  title: string;
  variant: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  shouldFadeOut: boolean; // New property to manage fade-out
}

interface AlertContextType {
  showAlert: (message: string, title?: string, variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info') => void;
  hideAlert: (id: number) => void; // Updated to hide by id
  alerts: Alert[]; // Updated to support multiple alerts
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
  const [alerts, setAlerts] = useState<Alert[]>([]);
  let alertId = useRef(0);

  const showAlert = useCallback((message: string, title: string = '', variant: 'default' | 'destructive' | 'success' | 'warning' | 'info' = 'default') => {
    const id = ++alertId.current; // Increment and use as new ID
    setAlerts(currentAlerts => [...currentAlerts, { id, message, title, variant, shouldFadeOut: false }]);
    // Set a timeout to mark the alert for fade out
    setTimeout(() => {
      setAlerts(currentAlerts => currentAlerts.map(alert => alert.id === id ? { ...alert, shouldFadeOut: true } : alert));
      // Optionally, automatically remove the alert after fade-out
      setTimeout(() => {
        setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
      }, 1000); // Assuming fade-out transition is 1s
    }, 5000); // Adjust time as needed
  }, []);

  const hideAlert = useCallback((id: number) => {
    setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alerts }}>
      {children}
    </AlertContext.Provider>
  );
};
