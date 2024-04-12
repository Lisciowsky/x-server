import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Alert} from '@/components/ui/alert';
import { useRef } from 'react';
interface Alert {
  id: number;
  message: string;
  title: string;
  variant: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  shouldFadeOut: boolean;
}

interface AlertContextType {
  showAlert: (message: string, title?: string, variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info') => void;
  hideAlert: (id: number) => void;
  alerts: Alert[];
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
    const id = ++alertId.current;
    setAlerts(currentAlerts => [...currentAlerts, { id, message, title, variant, shouldFadeOut: false }]);
    setTimeout(() => {
      setAlerts(currentAlerts => currentAlerts.map(alert => alert.id === id ? { ...alert, shouldFadeOut: true } : alert));
      setTimeout(() => {
        setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
      }, 1000);
    }, 5000);
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
