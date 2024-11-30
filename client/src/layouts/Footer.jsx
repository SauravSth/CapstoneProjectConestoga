import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and About */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-lg font-bold">Your Project Name</h2>
            <p className="text-sm text-gray-300 mt-2 text-center md:text-left">
              Your project’s tagline or a short description goes here. Build something amazing!
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link to="/" className="text-sm text-gray-300 hover:text-white">
              Home
            </Link>
            <Link to="/about" className="text-sm text-gray-300 hover:text-white">
              About
            </Link>
            <Link to="/contact" className="text-sm text-gray-300 hover:text-white">
              Contact
            </Link>
            <Link to="/privacy" className="text-sm text-gray-300 hover:text-white">
              Privacy Policy
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Your Project Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
