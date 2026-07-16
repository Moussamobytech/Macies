import { ShoppingCart } from 'lucide-react';

export function Orders() {
  const softwares = [
    { id: 1, name: "Suite Microsoft Office 2024", type: "Licence à vie", price: "25 000 FCFA" },
    { id: 2, name: "Logiciel de Gestion Comptable Pro", type: "Abonnement Annuel", price: "75 000 FCFA" },
    { id: 3, name: "Antivirus Premium", type: "1 Poste - 1 An", price: "15 000 FCFA" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vente de Logiciels</h1>
        <p className="text-gray-400">Achetez et téléchargez vos logiciels professionnels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {softwares.map(soft => (
          <div key={soft.id} className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:border-[#D4AF37]/30">
            <div className="h-32 bg-[#1A1A1A] flex items-center justify-center border-b border-[#333333]">
              <ShoppingCart size={40} className="text-[#D4AF37]/50" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-1">{soft.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{soft.type}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xl font-bold text-[#D4AF37]">{soft.price}</span>
                <button className="bg-[#333333] hover:bg-[#444444] text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                  Commander
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-[#333333] rounded-xl mt-8">
        <div className="p-6 border-b border-[#333333]">
          <h2 className="text-xl font-semibold">Mes Logiciels Achetés</h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-400">Vous n'avez acheté aucun logiciel pour le moment.</p>
        </div>
      </div>
    </div>
  );
}
