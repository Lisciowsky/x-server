import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gunmetal text-cultured p-4"> {/* Updated background and text color */}
      <div className="container mx-auto flex flex-wrap justify-between border-b border-cultured pb-4"> {/* Updated border color */}
        <div className="grid grid-cols-2 justify-between w-full sm:grid-cols-3">
          
          {/* Contact Information */}
          <div className="container mx-auto mb-4 px-2 col-span-1 sm:col-span-2">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-2 text-sm">
              <li>Email: contact@example.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Main St, City, Country</li>
            </ul>
          </div>
          {/* Social Links */}
          <div className="mb-4 px-2 col-span-1">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex flex-col justify-between">
              <a href="#" className="hover:text-sunset-orange"> {/* Updated hover color */}
                <FontAwesomeIcon icon={faFacebookF} className="mr-2" />Facebook
              </a>
              <a href="#" className="hover:text-sunset-orange"> {/* Updated hover color */}
                <FontAwesomeIcon icon={faXTwitter} className="mr-2" /> X
              </a>
              <a href="#" className="hover:text-sunset-orange"> {/* Updated hover color */}
                <FontAwesomeIcon icon={faInstagram} className="mr-2" />Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-4 pt-4 text-sm">
        © {new Date().getFullYear()} X-news. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
