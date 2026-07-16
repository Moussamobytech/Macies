export function Settings() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-gray-400">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className="bg-[#111111] border border-[#333333] rounded-xl p-8 space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-[#333333] pb-2 text-white">Profil Utilisateur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
              <input type="text" className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" defaultValue="Utilisateur Test" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Numéro de téléphone</label>
              <input type="text" className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" defaultValue="+223 76 50 60 05" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Adresse Email</label>
              <input type="email" className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" defaultValue="contact@macies.ml" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-[#333333] pb-2 text-white">Sécurité</h2>
          <div className="space-y-4">
            <button className="bg-[#333333] hover:bg-[#444444] text-white py-2.5 px-6 rounded-lg transition-colors text-sm font-medium">
              Changer le mot de passe
            </button>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-bold py-2.5 px-6 rounded-lg transition-colors">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}
