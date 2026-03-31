import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  ShoppingBag,
  Link as LinkIcon,
  DollarSign,
  Star,
  Tag,
  ChevronDown,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { getAllCategories } from "../../services/categoryApi";
import { uploadImage } from "../../services/uploadApi";

const emptyLink = { platform: "", url: "", price: "", affiliateTag: "", isActive: true };

export default function ProductForm({ open, onClose, onSave, anchorRect }) {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    images: [],
    price: "",
    currency: "INR",
    buyingLinks: [{ ...emptyLink }],
    rating: "",
  });

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMounted(true));
      getAllCategories()
        .then((res) => setCategories(res.data))
        .catch(console.error);
    } else {
      setMounted(false);
    }
  }, [open]);

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => onClose(), 250);
  };

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  /* Buying links helpers */
  const updateLink = (idx, field, value) => {
    const links = [...form.buyingLinks];
    links[idx] = { ...links[idx], [field]: value };
    setForm((f) => ({ ...f, buyingLinks: links }));
  };

  const addLink = () =>
    setForm((f) => ({ ...f, buyingLinks: [...f.buyingLinks, { ...emptyLink }] }));

  const removeLink = (idx) => {
    if (form.buyingLinks.length <= 1) return;
    setForm((f) => ({
      ...f,
      buyingLinks: f.buyingLinks.filter((_, i) => i !== idx),
    }));
  };

  /* Image upload */
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      update("images", [...form.images, res.data.url]);
    } catch (err) {
      console.error("Product image upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProductImage = (idx) => {
    update("images", form.images.filter((_, i) => i !== idx));
  };

  /* Submit */
  const handleSave = () => {
    if (!form.name.trim()) return alert("Product name is required");
    if (!form.category) return alert("Category is required");

    const cleaned = {
      ...form,
      price: form.price ? Number(form.price) : undefined,
      rating: form.rating ? Number(form.rating) : undefined,
      buyingLinks: form.buyingLinks.filter((l) => l.platform && l.url),
    };

    onSave(cleaned);
    handleClose();
    // Reset
    setForm({
      name: "",
      brand: "",
      category: "",
      description: "",
      images: [],
      price: "",
      currency: "INR",
      buyingLinks: [{ ...emptyLink }],
      rating: "",
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-250 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-900/10 border border-white/80 transition-all duration-300 ${
          mounted
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-6"
        }`}
        style={{
          transformOrigin: anchorRect
            ? `${anchorRect.x}px ${anchorRect.y}px`
            : "center center",
        }}
      >
        {/* Gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400" />

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-200">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Add Product</h3>
              <p className="text-xs text-gray-400">Attach a buyable product</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Product Name */}
          <FormField label="Product Name" icon={<Tag size={15} />}>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. iPhone 16 Pro Max"
              className="form-input"
            />
          </FormField>

          {/* Brand + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Brand">
              <input
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                placeholder="Apple"
                className="form-input"
              />
            </FormField>
            <FormField label="Category">
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="form-input appearance-none pr-8 cursor-pointer"
                >
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Brief product description..."
              rows={2}
              className="form-input resize-none"
            />
          </FormField>

          {/* Price + Currency + Rating */}
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Price" icon={<DollarSign size={15} />}>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="99999"
                className="form-input"
              />
            </FormField>
            <FormField label="Currency">
              <select
                value={form.currency}
                onChange={(e) => update("currency", e.target.value)}
                className="form-input cursor-pointer"
              >
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
              </select>
            </FormField>
            <FormField label="Rating" icon={<Star size={15} />}>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => update("rating", e.target.value)}
                placeholder="4.5"
                className="form-input"
              />
            </FormField>
          </div>

          {/* Product Images */}
          <FormField label="Product Images" icon={<ImageIcon size={15} />}>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeProductImage(idx)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-300 flex items-center justify-center cursor-pointer transition-colors">
                {uploadingImage ? (
                  <Loader2 size={16} className="animate-spin text-orange-400" />
                ) : (
                  <Plus size={16} className="text-gray-400" />
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </FormField>

          {/* Buying Links */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <LinkIcon size={15} className="text-orange-500" />
                Buying Links
              </label>
              <button
                onClick={addLink}
                className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
              >
                <Plus size={13} /> Add Link
              </button>
            </div>

            <div className="space-y-3">
              {form.buyingLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 space-y-2 animate-fadeInUp"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Link {idx + 1}</span>
                    {form.buyingLinks.length > 1 && (
                      <button
                        onClick={() => removeLink(idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={link.platform}
                      onChange={(e) => updateLink(idx, "platform", e.target.value)}
                      placeholder="Platform (Amazon, Flipkart)"
                      className="form-input text-xs"
                    />
                    <input
                      value={link.url}
                      onChange={(e) => updateLink(idx, "url", e.target.value)}
                      placeholder="https://..."
                      className="form-input text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={link.price}
                      onChange={(e) => updateLink(idx, "price", e.target.value)}
                      placeholder="Price on this platform"
                      className="form-input text-xs"
                    />
                    <input
                      value={link.affiliateTag}
                      onChange={(e) => updateLink(idx, "affiliateTag", e.target.value)}
                      placeholder="Affiliate tag (optional)"
                      className="form-input text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag size={16} />
              Add Product
            </span>
          </button>
        </div>
      </div>

      {/* Scoped styles */}
      <style>{`
        .form-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 0.75rem;
          outline: none;
          background: white;
          color: #374151;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
        .form-input::placeholder {
          color: #9ca3af;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* Small reusable label+input wrapper */
function FormField({ label, icon, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
        {icon && <span className="text-orange-500">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
