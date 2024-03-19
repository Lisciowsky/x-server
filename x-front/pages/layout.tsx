import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAlert } from '../context/AlertContext'; // Adjust the import path as needed
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Adjust the import path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { alerts, hideAlert } = useAlert();

  // No need for useEffect to manage timeouts, as this is handled in the context

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4">{children}</main>
      <div className="fixed bottom-0 right-0 m-4 space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            className={`transition-opacity duration-1000 ${alert.shouldFadeOut ? 'opacity-0' : 'opacity-100'}`}
          >
            <div className='grid grid-cols-12'>
              <div onClick={() => hideAlert(alert.id)} className='cursor-pointer col-span-1 flex justify-center items-center mr-4'>
                <FontAwesomeIcon icon={faXTwitter} />
              </div>
              <div className='col-span-11'>
                {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                <AlertDescription>{alert.message}</AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
      </div>
      <Footer />
    </div>
  );
};
export default Layout;