import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#101010] text-white py-6 flex flex-col items-center">
      {/* Contact Info */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <i className="fas fa-phone-alt text-amber-500 mr-2"></i>
          <span className="pr-6">+91 XXXXXXXXXX</span>
          <i className="fas fa-envelope text-amber-500 mr-2"></i>
          <a href="mailto:support@company.com" className="text-blue-400 hover:underline">
            foodhub@gmail.com
          </a>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="flex gap-4 mb-4">
        <a href="#" className="text-gray-400 hover:text-white text-lg">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-lg">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-lg">
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-lg">
          <i className="fab fa-github"></i>
        </a>
      </div>

      {/* Navigation Button */}
      <button
        className="cursor-pointer text-gray-400 hover:text-white mb-3"
        onClick={() => navigate("/ourteam")}
      >
        Our Team
      </button>

      {/* Copyright */}
      <div className="text-gray-400 text-sm text-center">
        &copy; {new Date().getFullYear()} FoodHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
