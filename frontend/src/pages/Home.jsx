import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import TrendingSection from "../components/home/TrendingSection";
import CategorySection from "../components/home/CategorySection";
import LatestBlogs from "../components/home/LatestBlogs";
import { Sparkles } from "lucide-react";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
        {/* Decorative elements - positioned behind content */}
        <div className="absolute -top-40 right-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* Content - on top of decorative elements */}
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center animate-fadeInUp">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <Sparkles size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">Welcome to TechPulse</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              Discover Amazing Tech Insights
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore trending articles, latest tech news, and in-depth product reviews all in one place.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => document.getElementById('trending-blogs')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg transition hover:scale-105"
              >
                Explore Now
              </button>
              <button className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div id="trending-blogs"> <TrendingSection />
        </div>
        <CategorySection categorySlug="smartphones" />
        <CategorySection categorySlug="automobiles" />
        <CategorySection categorySlug="robotics" />
        <div id="latest-blogs">
          <LatestBlogs />
        </div>
      </main>

      <Footer />

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

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-fill-mode: forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
};

export default Home;
