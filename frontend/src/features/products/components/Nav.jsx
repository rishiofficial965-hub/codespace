import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth";
import { FaUser, FaSignOutAlt, FaShoppingBag } from "react-icons/fa";

export default function Nav() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { handleLogout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-lacquered-licorice/10 px-6 py-4 flex items-center justify-between select-none">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-copper-green rounded-lg flex items-center justify-center shadow-md">
          <span className="text-albescent-white font-black text-base leading-none">S</span>
        </div>
        <span className="text-lg font-black tracking-tighter text-lacquered-licorice">SNITCH</span>
      </Link>

      {/* Nav Links & User Session */}
      <div className="flex items-center gap-6">
        <Link 
          to="/" 
          className="text-xs font-bold uppercase tracking-widest text-lacquered-licorice/60 hover:text-copper-green transition-colors"
        >
          Shop
        </Link>

        {user ? (
          <div className="flex items-center gap-4 border-l border-lacquered-licorice/10 pl-4">
            <Link 
              to="/profile" 
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-lacquered-licorice/60 hover:text-copper-green transition-colors"
            >
              <FaUser className="text-copper-green/80" size={12} />
              <span>Profile</span>
            </Link>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              title="Logout"
            >
              <FaSignOutAlt size={12} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-copper-green hover:text-lacquered-licorice transition-colors border border-copper-green/20 rounded-xl px-4 py-2 hover:bg-copper-green/5"
          >
            <FaUser size={11} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
