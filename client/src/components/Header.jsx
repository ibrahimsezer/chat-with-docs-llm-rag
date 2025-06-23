import React, { useState } from "react";
import sezermindLogo from "../assets/logos/favicon_io/sezermind_logo.png";
import ChatHistoryDrawer from "./ChatHistoryDrawer";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="w-full h-24 flex items-center justify-between px-4 md:px-8 bg-dark border-b border-[#232323] fixed top-0 left-0 z-30">
        {/* Sol: Hamburger Menü */}
        <button
          className="w-15 h-15 flex items-center justify-center rounded-full hover:bg-[#232323] transition-colors"
          onClick={() => setDrawerOpen(true)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
        </button>
        <h1 className="mb-2 mx-2 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">Sezermind</h1>
        {/* Orta: Boş */}
        <div className="flex-1" />
        {/* Sağ: Profil Fotoğrafı */}
        <button className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow hover:scale-105 transition-transform p-0">
          <img src={sezermindLogo} alt="Profil" className="w-16 h-16 object-cover block" />
        </button>
      </header>
      {/* Drawer ve overlay */}
      <ChatHistoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
};

export default Header; 