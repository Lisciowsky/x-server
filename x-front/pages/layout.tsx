import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAlert } from '../context/AlertContext'; // Adjust the import path as needed
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Adjust the import path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { alertState, hideAlert } = useAlert(); // Assuming alertState contains { isVisible, message, title, variant }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4">{children}</main>
      {/* Conditionally render the Alert component */}
      {alertState.isVisible && (
        <div className="grid grid-cols-12 p-0 m-0">
          <div className='col-span-9'></div>
          <Alert variant={alertState.variant} className="mb-4 col-span-3 bg-red-400">
            <div className='grid grid-cols-12'>
              <div onClick={() => hideAlert()} className='cursor-pointer col-span-1 flex justify-center items-center mr-4'><FontAwesomeIcon icon={faXTwitter}/></div>
              <div className='col-span-11'>
                {alertState.title && <AlertTitle>{alertState.title}</AlertTitle>}
                <AlertDescription>{alertState.message}</AlertDescription>
              </div>
            </div>
          </Alert>
          <button onClick={hideAlert} className="text-sm underline">Close</button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
