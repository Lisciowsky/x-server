const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white p-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center border-b border-gray-500 pb-4">
        {/* About Section */}
        <div className="w-full md:flex-1 mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">About Us</h3>
          <p className="mt-2">
            We are committed to delivering the best experience. Our goal is to create impactful and meaningful interactions.
          </p>
        </div>

        {/* Contact Information */}
        <div className="w-full md:flex-1 mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <ul className="mt-2">
            <li>Email: contact@example.com</li>
            <li>Phone: (123) 456-7890</li>
            <li>Address: 123 Main St, City, Country</li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="w-full md:flex-1">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex mt-2 space-x-4">
            <a href="#" className="hover:text-gray-400">Facebook</a>
            <a href="#" className="hover:text-gray-400">Twitter</a>
            <a href="#" className="hover:text-gray-400">Instagram</a>
          </div>
        </div>
      </div>
      <div className="text-center mt-4 pt-4">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
