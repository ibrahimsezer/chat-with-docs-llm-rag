import React from "react";

const Header = () => (
  <header className="w-full h-16 flex items-center justify-between px-4 md:px-8 bg-dark border-b border-[#232323] fixed top-0 left-0 z-30">
    {/* Sol: Hamburger Menü */}
    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#232323] transition-colors">
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
    </button>
    {/* Orta: Boş */}
    <div className="flex-1" />
    {/* Sağ: Profil Fotoğrafı */}
    <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow hover:scale-105 transition-transform">
      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profil" className="w-full h-full object-cover" />
    </button>
  </header>
);

export default Header; 