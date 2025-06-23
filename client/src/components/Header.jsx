import React, { useState, useRef, useEffect } from "react";
import sezermindLogo from "../assets/logos/favicon_io/sezermind_logo.png";
import ChatHistoryDrawer from "./ChatHistoryDrawer";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const authRef = useRef();

  // Popup dışında tıklanınca kapat
  useEffect(() => {
    if (!authOpen) return;
    const handleClick = (e) => {
      if (authRef.current && !authRef.current.contains(e.target)) {
        setAuthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [authOpen]);

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
        <button
          className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow hover:scale-105 transition-transform p-0 relative"
          onClick={() => setAuthOpen((v) => !v)}
        >
          <img src={sezermindLogo} alt="Profil" className="w-16 h-16 object-cover block" />
        </button>
        {/* Auth Popup */}
        {authOpen && (
          <div ref={authRef} className="absolute top-24 right-8 z-50 bg-[#232425] border border-[#444] rounded-xl shadow-xl p-6 flex flex-col items-center min-w-[260px] animate-fade-in-move">
            <span className="text-lg font-semibold text-light mb-4">Giriş / Kayıt Ol</span>
            <button className="w-full flex items-center justify-center gap-2 bg-white text-dark font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-100 transition mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>              Google ile Giriş Yap
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-light font-semibold py-2 px-4 rounded-lg shadow hover:bg-[#2fa3a8] transition">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>              Google ile Kayıt Ol
            </button>
          </div>
        )}
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