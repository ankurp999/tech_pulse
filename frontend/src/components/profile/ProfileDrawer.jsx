import { X, PenLine, BookOpen, LogOut, User, Mail, Sparkles, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProfileDrawer = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      // Small delay so the transition plays
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  };

  const handleNav = (path) => {
    handleClose();
    setTimeout(() => navigate(path), 320);
  };

  if (!open) return null;

  const initials = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Drawer panel */}
      <div
        className={`relative w-80 sm:w-96 h-full bg-white/80 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Decorative gradient top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all duration-200 hover:rotate-90"
        >
          <X size={18} />
        </button>

        <div className="p-6 pt-10 h-full flex flex-col">
          {/* Profile header */}
          <div
            className={`flex flex-col items-center mb-8 transition-all duration-500 delay-100 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-green-200/50">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
            </div>

            {/* User info */}
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {user?.username || "User"}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Mail size={13} />
              <span>{user?.email || "No email"}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

          {/* Navigation Actions */}
          <div
            className={`flex flex-col gap-2 flex-1 transition-all duration-500 delay-200 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <DrawerItem
              icon={<PenLine size={18} />}
              label="Create Blog"
              description="Write a new story"
              onClick={() => handleNav("/create")}
              gradient="from-green-500 to-emerald-600"
            />
            <DrawerItem
              icon={<BookOpen size={18} />}
              label="My Blogs"
              description="View published stories"
              onClick={() => handleNav("/my-blogs")}
              gradient="from-blue-500 to-indigo-600"
            />
            <DrawerItem
              icon={<Bookmark size={18} />}
              label="Saved Blogs"
              description="Your bookmarked reads"
              onClick={() => handleNav("/saved")}
              gradient="from-amber-500 to-orange-600"
            />
            <DrawerItem
              icon={<User size={18} />}
              label="Profile Settings"
              description="Manage your account"
              onClick={() => handleNav("/profile")}
              gradient="from-purple-500 to-violet-600"
            />
          </div>

          {/* Bottom section */}
          <div
            className={`pt-4 border-t border-gray-100 transition-all duration-500 delay-300 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <button
              onClick={() => {
                localStorage.clear();
                handleNav("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                <LogOut size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Sign Out</p>
                <p className="text-xs text-red-300">See you soon!</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Drawer Menu Item */
function DrawerItem({ icon, label, description, onClick, gradient }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group text-left w-full"
    >
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
          {label}
        </p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </button>
  );
}

export default ProfileDrawer;
