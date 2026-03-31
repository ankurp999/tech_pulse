import {
  X,
  ShoppingBag,
  Star,
  ExternalLink,
  Tag,
  ChevronRight,
  ImageIcon,
} from "lucide-react";

const currencySymbol = (code) =>
  code === "USD" ? "$" : code === "EUR" ? "€" : "₹";

export default function ProductShowcase({ products, onRemove }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-10 mb-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm shadow-green-200">
          <ShoppingBag size={15} className="text-white" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-800 tracking-wide">
            Related Products
          </h4>
          <p className="text-[11px] text-gray-400">
            {products.length} product{products.length > 1 ? "s" : ""} attached
          </p>
        </div>
      </div>

      {/* Product Cards */}
      <div className="space-y-4">
        {products.map((product, idx) => (
          <ProductCard
            key={idx}
            product={product}
            index={idx}
            onRemove={() => onRemove(idx)}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, index, onRemove }) {
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
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fadeInUp"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
      >
        <X size={13} />
      </button>

      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="sm:w-44 flex-shrink-0">
          {images.length > 0 ? (
            <div className="relative h-40 sm:h-full overflow-hidden bg-gray-50">
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
            <div className="h-40 sm:h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <ShoppingBag size={28} className="text-gray-300" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 p-4 sm:p-5 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h5 className="text-base font-bold text-gray-900 leading-snug line-clamp-1">
              {name}
            </h5>
          </div>

          {/* Brand + Rating */}
          <div className="flex items-center gap-3 mb-2.5">
            {brand && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                <Tag size={10} />
                {brand}
              </span>
            )}
            {rating && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                <Star size={10} fill="currentColor" />
                {rating}
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {/* Price + Buy Links row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Price badge */}
            {price && (
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-gray-900">
                  {currencySymbol(currency)}
                  {Number(price).toLocaleString()}
                </span>
              </div>
            )}

            {/* Buying link pills */}
            {buyingLinks
              .filter((l) => l.platform && l.url)
              .map((link, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg"
                >
                  <ExternalLink size={11} />
                  {link.platform}
                  {link.price && (
                    <span className="text-gray-400 font-normal">
                      · {currencySymbol(currency)}
                      {Number(link.price).toLocaleString()}
                    </span>
                  )}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
