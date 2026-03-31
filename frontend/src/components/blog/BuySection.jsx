import {
  ShoppingBag,
  Star,
  ExternalLink,
  Tag,
} from "lucide-react";

const currencySymbol = (code) =>
  code === "USD" ? "$" : code === "EUR" ? "€" : "₹";

const BuySection = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-2">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200/50">
          <ShoppingBag size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Buy Related Products
          </h3>
          <p className="text-xs text-gray-400">
            {products.length} product{products.length > 1 ? "s" : ""} linked to
            this article
          </p>
        </div>
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {products.map((product, idx) => (
          <ProductCard key={product._id || idx} product={product} index={idx} />
        ))}
      </div>
    </div>
  );
};

function ProductCard({ product, index }) {
  const {
    name,
    brand,
    description,
    price,
    currency = "INR",
    rating,
    images = [],
    buyingLinks = [],
  } = product;

  return (
    <div
      className="group relative bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="sm:w-48 flex-shrink-0">
          {images.length > 0 ? (
            <div className="relative h-44 sm:h-full overflow-hidden bg-gray-50">
              <img
                src={images[0]}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  +{images.length - 1} more
                </div>
              )}
            </div>
          ) : (
            <div className="h-44 sm:h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <ShoppingBag size={32} className="text-gray-300" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 p-5 sm:p-6 min-w-0">
          {/* Title */}
          <h4 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 mb-2">
            {name}
          </h4>

          {/* Brand + Rating */}
          <div className="flex items-center gap-3 mb-3">
            {brand && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-md">
                <Tag size={10} />
                {brand}
              </span>
            )}
            {rating && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-md">
                <Star size={10} fill="currentColor" />
                {rating}
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
              {description}
            </p>
          )}

          {/* Price + Buy Links */}
          <div className="flex flex-wrap items-center gap-3">
            {price && (
              <span className="text-lg font-bold text-gray-900">
                {currencySymbol(currency)}
                {Number(price).toLocaleString()}
              </span>
            )}

            {buyingLinks
              .filter((l) => l.platform && l.url)
              .map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg hover:bg-green-100 hover:shadow-sm transition-all duration-200"
                >
                  <ExternalLink size={11} />
                  Buy on {link.platform}
                  {link.price && (
                    <span className="text-gray-400 font-normal">
                      · {currencySymbol(currency)}
                      {Number(link.price).toLocaleString()}
                    </span>
                  )}
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuySection;
