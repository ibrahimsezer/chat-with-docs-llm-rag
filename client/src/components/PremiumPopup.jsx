import React from "react";

const premiumPackages = [
  {
    id: 1,
    name: "Premium Mini",
    price: "$5/ay",
    features: ["Aylık 1000 sorgu", "Öncelikli destek", "Reklamsız kullanım"],
  },
  {
    id: 2,
    name: "Premium Standart",
    price: "$10/ay",
    features: ["Aylık 5000 sorgu", "Öncelikli destek", "Gelişmiş analizler", "Reklamsız kullanım"],
  },
  {
    id: 3,
    name: "Premium Pro",
    price: "$50/ay",
    features: ["Sınırsız sorgu", "Öncelikli destek", "Gelişmiş analizler", "Özel entegrasyonlar", "Reklamsız kullanım"],
  },
];

const PremiumPopup = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <>
      {/* Buğulu arka plan */}
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50" />
      {/* Popup içerik */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-[#232425] border border-primary rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 animate-fade-in-move relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-secondary hover:text-primary text-2xl font-bold">×</button>
          <h2 className="text-2xl font-bold text-light mb-6 text-center">Premium Paketler</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
            {premiumPackages.map((pkg) => (
              <div key={pkg.id} className="flex-1 bg-dark rounded-xl p-6 border border-[#444] flex flex-col items-center shadow-md">
                <h3 className="text-xl font-semibold text-primary mb-2">{pkg.name}</h3>
                <div className="text-2xl font-bold text-light mb-4">{pkg.price}</div>
                <ul className="mb-6 text-secondary text-sm space-y-1">
                  {pkg.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
                <button className="bg-primary hover:bg-[#2fa3a8] text-light px-6 py-2 rounded-lg font-semibold shadow transition">Satın Al</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumPopup; 