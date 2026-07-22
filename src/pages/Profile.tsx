import { User, Mail } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
        <p className="text-gray-400">Consultez et modifiez vos informations personnelles.</p>
      </div>

      <div className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden">
        <div className="p-8 border-b border-[#333333] flex items-center gap-6 bg-[#1A1A1A]">
          <div className="w-24 h-24 bg-[#333333] rounded-full flex items-center justify-center border-4 border-[#D4AF37]/20">
            <User size={48} className="text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name || 'Utilisateur'}</h2>
            <p className="text-[#D4AF37] font-medium">{user?.role === 'ADMIN' ? 'Administrateur' : 'Client Standard'}</p>
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-[#333333] pb-2 flex items-center gap-2">
              <User size={18} className="text-[#D4AF37]" />
              Informations Personnelles
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Nom Complet</label>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Rôle</label>
                <p className="text-white font-medium">{user?.role === 'ADMIN' ? 'Administrateur' : 'Client'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-[#333333] pb-2 flex items-center gap-2">
              <Mail size={18} className="text-[#D4AF37]" />
              Coordonnées
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Téléphone</label>
                <p className="text-white font-medium italic text-gray-400">Géré depuis les paramètres</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-[#1A1A1A] border-t border-[#333333] flex justify-end gap-4">
          <button className="bg-[#333333] hover:bg-[#444444] text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Changer le mot de passe
          </button>
          <button className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-bold py-2 px-6 rounded-lg transition-colors">
            Modifier le profil
          </button>
        </div>
      </div>
    </div>
  );
}
