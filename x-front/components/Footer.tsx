import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gunmetal text-cultured p-4"> {/* Updated background and text color */}
      <div className="container mx-auto flex flex-wrap justify-between items-center border-b border-cultured pb-4"> {/* Updated border color */}
        <div className="flex flex-wrap justify-between items-center w-full">
          
          {/* Contact Information */}
          <div className="flex-1 min-w-[30%] mb-4 md:mb-0 px-2">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="mt-2 text-sm">
              <li>Email: contact@example.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Main St, City, Country</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex-1 min-w-[30%] mb-4 md:mb-0 px-2">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex mt-2 space-x-4 text-sm">
              <a href="#" className="hover:text-sunset-orange"> {/* Updated hover color */}
                <FontAwesomeIcon icon={faFacebookF} className="mr-2" />Facebook
              </a>
              <a href="#" className="hover:text-sunset-orange"> {/* Updated hover color */}
                <FontAwesomeIcon icon={faTwitter} className="mr-2" />Twitter
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
