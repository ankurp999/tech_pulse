import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="animate-fadeInUp">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-4 text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg"></div>
              TechPulse
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your daily dose of tech insights, trending articles, and in-depth product reviews.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/category/smartphones"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  Smartphones
                </Link>
              </li>
              <li>
                <Link
                  to="/category/automobiles"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  Automobiles
                </Link>
              </li>
              <li>
                <Link
                  to="/category/robotics"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  Robotics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                  Contact
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-green-600 transition-colors duration-200">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-green-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-blue-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
          <p className="flex items-center gap-1">
            © {currentYear} TechPulse. Made with
            <Heart size={16} className="text-red-500" />
            by the tech community.
          </p>
          <p className="mt-4 sm:mt-0">All rights reserved. | Privacy • Terms • Contact</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
