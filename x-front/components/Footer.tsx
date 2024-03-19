import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="bg-gunmetal text-cultured p-4"> {/* Updated background and text color */}
      <div className="grid grid-rows-2 justify-center items-center grid-flow-row">
        <h3 className="text-xl font-semibold row-span-1 ml-4 mb-4">Follow Us</h3>
        <div className="row-span-1 space-x-5">
          <a href="#" className="hover:text-sunset-orange"> {/* Updated hover color */}
            <FontAwesomeIcon icon={faFacebookF} size="xl" className="mr-2" />
          </a>
          <a href="#" className="hover:text-sunset-orange"> {/* Updated hover color */}
            <FontAwesomeIcon icon={faXTwitter} size="xl" className="mr-2" />
          </a>
          <a href="#" className="hover:text-sunset-orange"> {/* Updated hover color */}
            <FontAwesomeIcon icon={faInstagram} size="xl" className="mr-2" />
          </a>
        </div>
      </div>
      <div className="text-center mt-4 pt-4 text-sm">
        © {new Date().getFullYear()} X-news. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
