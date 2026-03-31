import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Image,
  Video,
  Code,
  FileText,
  LayoutGrid,
  MoreHorizontal,
  X,
  Plus,
  Sparkles,
  ChevronDown,
  Loader2,
  CheckCircle2,
  PenLine,
  ShoppingBag,
} from "lucide-react";
import { createBlog, getBlogById, updateBlog } from "../services/blogApi";
import { getAllCategories } from "../services/categoryApi";
import { uploadImage } from "../services/uploadApi";
import { createProduct } from "../services/productApi";
import ProductForm from "../components/blog/ProductForm";
import ProductShowcase from "../components/blog/ProductShowcase";

export default function CreateBlog() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const [blocks, setBlocks] = useState([{ id: 1, content: "", imageUrl: null }]);
  const [activeBlock, setActiveBlock] = useState(null);
  const [hoverMenu, setHoverMenu] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [uploadingBlockId, setUploadingBlockId] = useState(null);
  const [published, setPublished] = useState(false);
  const [drafted, setDrafted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productFormAnchor, setProductFormAnchor] = useState(null);
  const [products, setProducts] = useState([]);
  const [existingProductIds, setExistingProductIds] = useState([]);
  const [fetching, setFetching] = useState(!!editId);

  const navigate = useNavigate();

  const blockRefs = useRef({});
  const fileInputRef = useRef({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  /* Fetch draft blog for editing */
  useEffect(() => {
    if (!editId) return;
    const fetchDraft = async () => {
      try {
        const res = await getBlogById(editId);
        const blog = res.data.blog;

        setTitle(blog.title || "");
        setCategory(
          blog.category?._id || blog.category || ""
        );

        // Rebuild blocks from content + images
        const contentLines = (blog.content || "").split("\n");
        const images = blog.images || [];
        const newBlocks = [];
        const len = Math.max(contentLines.length, images.length);
        for (let i = 0; i < len; i++) {
          newBlocks.push({
            id: i + 1,
            content: contentLines[i] || "",
            imageUrl: images[i] || null,
          });
        }
        if (newBlocks.length === 0) {
          newBlocks.push({ id: 1, content: "", imageUrl: null });
        }
        setBlocks(newBlocks);

        // Existing products (already created in DB)
        if (blog.relatedProducts && blog.relatedProducts.length > 0) {
          setExistingProductIds(blog.relatedProducts.map((p) => p._id || p));
          setProducts(blog.relatedProducts.filter((p) => typeof p === "object"));
        }
      } catch (err) {
        console.error("Failed to load draft:", err);
        alert("Could not load draft");
        navigate("/my-blogs");
      } finally {
        setFetching(false);
      }
    };
    fetchDraft();
  }, [editId]);

  /* ---------------- Submit (publish or draft) ---------------- */

  const handleSubmit = async (status = "published") => {
    const isDraft = status === "draft";

    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }

    // For publish, require at least one image; drafts are more lenient
    const images = blocks
      .filter((block) => block.imageUrl)
      .map((block) => block.imageUrl);

    if (!isDraft && images.length === 0) {
      alert("At least one image is required");
      return;
    }

    isDraft ? setSavingDraft(true) : setLoading(true);
    try {
      const contentString = blocks
        .map((block) => block.content)
        .filter((text) => text.trim() !== "")
        .join("\n");

      if (!isDraft && !contentString.trim()) {
        alert("Content is required");
        isDraft ? setSavingDraft(false) : setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", contentString || " ");
      formData.append("category", category);
      formData.append("status", status);

      const imgs = blocks
        .filter((block) => block.imageUrl)
        .map((block) => block.imageUrl);

      // Create products first if any (only new ones, not existing)
      const productIds = [...existingProductIds];
      const newProducts = products.filter((p) => !p._id);
      for (const product of newProducts) {
        try {
          const prodRes = await createProduct(product);
          productIds.push(prodRes.data._id);
        } catch (err) {
          console.error("Product creation failed:", err);
        }
      }

      formData.append("tags", JSON.stringify([]));
      formData.append("relatedProducts", JSON.stringify(productIds));
      formData.append("images", JSON.stringify(imgs));
      formData.append("hasBuyingLinks", productIds.length > 0 ? "true" : "false");

      if (isEditMode) {
        await updateBlog(editId, formData);
      } else {
        await createBlog(formData);
      }

      if (isDraft) {
        setDrafted(true);
        setTimeout(() => {
          navigate("/my-blogs");
        }, 2000);
      } else {
        setPublished(true);
        setTimeout(() => {
          navigate("/");
        }, 2500);
      }

    } catch (error) {
      console.error(error);
      alert(isDraft ? "Failed to save draft" : "Publish failed");
    } finally {
      setLoading(false);
      setSavingDraft(false);
    }
  };

  const handlePublish = () => handleSubmit("published");
  const handleSaveDraft = () => handleSubmit("draft");

  const focusBlock = (id) => {
    const el = blockRefs.current[id];
    if (el) {
      el.focus();
      placeCaretAtEnd(el);
    }
  };

  const placeCaretAtEnd = (el) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  /* ---------------- Block Logic ---------------- */

  const addBlock = (index) => {
    const newBlock = { id: Date.now(), content: "", imageUrl: null };
    const updated = [...blocks];
    updated.splice(index + 1, 0, newBlock);
    setBlocks(updated);

    setTimeout(() => focusBlock(newBlock.id), 0);
  };

  const deleteBlock = (index) => {
    if (blocks.length === 1) return;

    const prevId = blocks[index - 1]?.id;
    const updated = blocks.filter((_, i) => i !== index);
    setBlocks(updated);

    setTimeout(() => focusBlock(prevId), 0);
  };

  const updateContent = (id, value) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, content: value } : block
      )
    );
  };

  /* Handle image upload */
  const handleImageUpload = async (blockId) => {
    const fileInput = fileInputRef.current[blockId];
    const file = fileInput?.files[0];

    if (!file) return;

    setUploadingBlockId(blockId);
    try {
      const response = await uploadImage(file);
      const imageUrl = response.data.url;

      setBlocks(
        blocks.map((block) =>
          block.id === blockId ? { ...block, imageUrl } : block
        )
      );

      setHoverMenu(null);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setUploadingBlockId(null);
    }
  };

  const removeImage = (blockId) => {
    setBlocks(
      blocks.map((block) =>
        block.id === blockId ? { ...block, imageUrl: null } : block
      )
    );
  };

  // Word count
  const wordCount = blocks.reduce((acc, block) => {
    return acc + (block.content.trim() ? block.content.trim().split(/\s+/).length : 0);
  }, 0) + (title.trim() ? title.trim().split(/\s+/).length : 0);

  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  /* Show loading if fetching draft */
  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <Loader2 size={32} className="text-green-500 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading draft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Success Toast */}
      {published && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
          <div className="flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg shadow-green-200">
            <CheckCircle2 size={20} />
            <span className="font-medium">Blog Published Successfully!</span>
            <Sparkles size={16} className="animate-pulse" />
          </div>
        </div>
      )}

      {/* Draft Saved Toast */}
      {drafted && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
          <div className="flex items-center gap-3 bg-amber-500 text-white px-6 py-3 rounded-full shadow-lg shadow-amber-200">
            <CheckCircle2 size={20} />
            <span className="font-medium">Draft Saved!</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <nav
        className={`sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-500 ${
          mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <PenLine size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">TechPulse</h1>
              <p className="text-xs text-gray-400">{isEditMode ? "Edit Draft" : "Create Story"}</p>
            </div>
            <h1 className="text-lg font-bold text-gray-900 sm:hidden">TechPulse</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Word count badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              <span>{wordCount} words</span>
              <span className="text-gray-300">·</span>
              <span>{readTime} min read</span>
            </div>

            {/* Save Draft */}
            <button
              onClick={handleSaveDraft}
              disabled={savingDraft || loading || !title.trim() || !category}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                savingDraft || loading || !title.trim() || !category
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 active:scale-95"
              }`}
            >
              {savingDraft ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <FileText size={14} />
                  <span className="hidden sm:inline">Save Draft</span>
                  <span className="sm:hidden">Draft</span>
                </span>
              )}
            </button>

            {/* Publish */}
            <button
              onClick={handlePublish}
              disabled={loading || savingDraft || !category}
              className={`group relative px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden ${
                loading || savingDraft || !category
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-200 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="hidden sm:inline">Publishing...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles size={14} className={!category ? "" : "group-hover:animate-pulse"} />
                  Publish
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Editor Area */}
      <div
        className={`max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-32 transition-all duration-700 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {/* Title Input */}
        <div className="mb-6 sm:mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-3xl sm:text-4xl md:text-5xl font-bold outline-none bg-transparent text-gray-900 placeholder:text-gray-300 transition-colors focus:placeholder:text-gray-200"
          />
          <div className="mt-3 h-px bg-gradient-to-r from-green-300 via-emerald-200 to-transparent" />
        </div>

        {/* Category Selector */}
        <div className="mb-8 sm:mb-10">
          <div className="relative inline-block w-full sm:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Content Blocks */}
        <div className="space-y-1">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className={`relative group/block transition-all duration-300 ${
                activeBlock === block.id ? "scale-[1.001]" : ""
              }`}
            >
              {/* Plus Button - responsive positioning */}
              {activeBlock === block.id && (
                <div
                  className="absolute -left-3 sm:-left-12 top-0.5 z-10"
                  onMouseEnter={() => setHoverMenu(block.id)}
                >
                  <button
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      hoverMenu === block.id
                        ? "border-green-500 bg-green-500 text-white rotate-45 scale-110"
                        : "border-gray-300 text-gray-400 hover:border-green-400 hover:text-green-500"
                    }`}
                    onClick={() =>
                      setHoverMenu(hoverMenu === block.id ? null : block.id)
                    }
                  >
                    <Plus size={16} />
                  </button>

                  {/* Floating Tool Menu */}
                  {hoverMenu === block.id && (
                    <div className="absolute top-0 left-9 sm:left-10 z-20 animate-scaleIn origin-left">
                      <div className="flex items-center gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <ToolButton
                          icon={<X size={16} />}
                          label="Close"
                          onClick={() => setHoverMenu(null)}
                          variant="close"
                        />
                        <ToolButton
                          icon={<Image size={16} />}
                          label="Image"
                          onClick={() => fileInputRef.current[block.id]?.click()}
                        />
                        <ToolButton
                          icon={<ShoppingBag size={16} />}
                          label="Product"
                          onClick={(e) => {
                            const rect = e?.target?.getBoundingClientRect?.();
                            setProductFormAnchor(rect ? { x: rect.x, y: rect.y } : null);
                            setProductFormOpen(true);
                            setHoverMenu(null);
                          }}
                        />
                        <ToolButton icon={<LayoutGrid size={16} />} label="Grid" />
                        <ToolButton icon={<Video size={16} />} label="Video" className="hidden sm:flex" />
                        <ToolButton icon={<Code size={16} />} label="Code" className="hidden sm:flex" />
                        <ToolButton icon={<FileText size={16} />} label="File" className="hidden sm:flex" />
                        <ToolButton icon={<MoreHorizontal size={16} />} label="More" className="sm:hidden" />
                        <input
                          ref={(el) => (fileInputRef.current[block.id] = el)}
                          type="file"
                          accept="image/*"
                          onChange={() => handleImageUpload(block.id)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Editable Content Block */}
              <div
                className={`pl-6 sm:pl-0 rounded-lg transition-all duration-200 ${
                  activeBlock === block.id
                    ? "bg-gray-50/50"
                    : "hover:bg-gray-50/30"
                }`}
              >
                <div
                  ref={(el) => (blockRefs.current[block.id] = el)}
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => setActiveBlock(block.id)}
                  onBlur={() => {
                    // Delay to allow menu clicks
                    setTimeout(() => {
                      if (hoverMenu !== block.id) setActiveBlock(null);
                    }, 200);
                  }}
                  onInput={(e) =>
                    updateContent(block.id, e.currentTarget.textContent)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addBlock(index);
                    }

                    if (
                      e.key === "Backspace" &&
                      block.content === "" &&
                      index > 0
                    ) {
                      e.preventDefault();
                      deleteBlock(index);
                    }
                  }}
                  data-placeholder="Tell your story..."
                  className="text-base sm:text-lg text-gray-800 outline-none min-h-[32px] py-2 px-1 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 empty:before:pointer-events-none"
                />
              </div>

              {/* Image Upload Progress */}
              {uploadingBlockId === block.id && (
                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl animate-pulse">
                  <Loader2 size={18} className="animate-spin text-green-500" />
                  <span>Uploading image...</span>
                </div>
              )}

              {/* Image Preview */}
              {block.imageUrl && (
                <div className="mt-3 mb-4 relative group/img animate-fadeInUp">
                  <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                    <img
                      src={block.imageUrl}
                      alt="uploaded"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover/img:scale-[1.01]"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(block.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-200 backdrop-blur-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Attached Products */}
        <ProductShowcase
          products={products}
          onRemove={(idx) => setProducts(products.filter((_, i) => i !== idx))}
        />

        {/* Bottom hint */}
        <div className="mt-12 flex items-center gap-2 text-sm text-gray-300">
          <span>Press</span>
          <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-400 border border-gray-200">
            Enter
          </kbd>
          <span>for new block</span>
          <span className="mx-1">·</span>
          <span className="text-green-400 flex items-center gap-1">
            <Plus size={12} />
            for media
          </span>
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductForm
        open={productFormOpen}
        onClose={() => setProductFormOpen(false)}
        anchorRect={productFormAnchor}
        onSave={(product) => setProducts((prev) => [...prev, product])}
      />

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* Reusable Tool Button */
function ToolButton({ icon, label, onClick, variant, className = "" }) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick && onClick(e);
      }}
      title={label}
      className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
        variant === "close"
          ? "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
          : "border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 hover:scale-110 active:scale-95"
      } ${className}`}
    >
      {icon}
    </button>
  );
}

