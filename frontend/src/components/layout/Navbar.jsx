import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../services/categoryApi";
import { useNavigate } from "react-router-dom";
import { ChevronDown, PenTool, Menu, X } from "lucide-react";
import ProfileDrawer from "../profile/ProfileDrawer";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = localStorage.getItem("accessToken");

  useEffect(() => {
    getAllCategories()
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("NAVBAR CATEGORY ERROR ❌", err);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg"></div>
              TechPulse
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 flex-1 ml-8">
              {categories.slice(0, 3).map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className="text-gray-600 hover:text-green-600 capitalize font-medium transition-colors duration-200 relative group"
                >
                  {cat.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}

              {categories.length > 3 && (
                <div className="group relative">
                  <button className="text-gray-600 hover:text-green-600 font-medium flex items-center gap-1 transition-colors duration-200">
                    More
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                    {categories.slice(3).map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors capitalize"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Write Button */}
              <Link
                to={isLoggedIn ? "/create" : "/login"}
                state={!isLoggedIn ? { from: "/create" } : undefined}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <PenTool size={18} />
                Write
              </Link>

              {/* Auth Section */}
              {isLoggedIn ? (
                <button
                  onClick={() => setOpen(true)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  {JSON.parse(localStorage.getItem("user"))?.username?.charAt(0)?.toUpperCase() || "U"}
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    to="/register"
                    className="px-4 py-2 text-gray-700 font-medium hover:text-green-600 transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 animate-slideDown">
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    className="block px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg capitalize transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              {!isLoggedIn && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <ProfileDrawer open={open} setOpen={setOpen} />

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
