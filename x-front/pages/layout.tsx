// components/Layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
};
 
export default Layout;
