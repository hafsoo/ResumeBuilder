import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ================= HEADER ================= */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "fixed top-0 left-0 right-0 z-50 bg-[#0b1c2c] shadow-md"
            : "relative bg-[#0b1c2c]"
        }`}
      >
        {/* ================= MOBILE ================= */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 text-white bg-gradient-to-b from-[#020617] to-[#020617]">
          <button onClick={() => setOpen(true)}>
            <BiMenuAltLeft size={28} />
          </button>

           <Link to="/" className="flex items-center gap-1">
    <div className="w-[38px] h-[38px] rounded-[10px] border border-cyan-400/40 flex items-center justify-center overflow-hidden">
      <img
        src="/logo.png"
        alt="Back2U Logo"
        className="w-full h-full object-contain scale-110"
      />
    </div>
    <div className="flex flex-col leading-tight">
      <span className="text-sm font-extrabold text-white tracking-wide">
        Resume<span className="text-cyan-400">Builder</span>
      </span>
      
    </div>
  </Link>

          {isAuthenticated ? (
            <Link to="/profile">
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                   className="
                  w-9 h-9 rounded-full object-cover
                  border border-white/30
                  hover:ring-2 hover:ring-cyan-300
                  transition
                  "
                  alt="profile"
                />
              ) : (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          ) : (
            <Link to="/login">
              <CgProfile size={26} />
            </Link>
          )}
        </div>

        {/* ================= DESKTOP ================= */}
        <div
          className="
          hidden lg:flex
          items-center justify-between
          px-16 h-[80px]
          bg-gradient-to-b from-[#020617] to-[#020617]
          text-white
        "
        >
         <Link to="/" className="group flex items-center gap-2">
  {/* Logo with thin cyan border */}
  <div className="w-[44px] h-[44px] rounded-[14px] border border-cyan-400/40 flex items-center justify-center transition-all duration-300 group-hover:border-cyan-400/70 overflow-hidden">
    <img
      src="/logo.png"
      alt=" Logo"
      className="w-full h-full object-contain scale-110"
    />
  </div>

  {/* Text */}
  <div className="flex flex-col leading-tight">
    <span className="text-2xl font-extrabold tracking-wide text-white">
      Resume
      <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
        Builder
      </span>
    </span>
    
  </div>
</Link>

         

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">

            {/* Profile / Login */}
            {isAuthenticated ? (
              <Link to="/profile">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    className="
                  w-9 h-9 rounded-full object-cover
                  border border-white/30
                  hover:ring-2 hover:ring-cyan-300
                  transition
                  "
                    alt="profile"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-2xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg border-2 border-blue-500 hover:shadow-md hover:ring-4 hover:ring-blue-200 transition-all duration-300">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:text-white text-sm transition"
              >
                <CgProfile size={32}/>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: scrolled ? "70px" : "0px" }} />

      {/* ================= MOBILE SIDEBAR ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-3/4 max-w-xs h-full bg-[#0b1c2c] text-white p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-lg">Menu</h2>
              <button onClick={() => setOpen(false)}>
                <RxCross1 size={22} />
              </button>
            </div>
\

          
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

