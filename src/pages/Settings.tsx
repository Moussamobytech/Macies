import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { fetchApi } from '../services/api';

export function Settings() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const data = await fetchApi('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({ name, email, phone }),
      });
      updateUser(data.user);
      setStatus({ type: 'success', message: 'Paramètres enregistrés avec succès.' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-gray-400">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#111111] border border-[#333333] rounded-xl p-8 space-y-8">
        {status && (
          <div className={`p-4 rounded-lg flex items-center gap-2 border ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {status.message}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-[#333333] pb-2 text-white">Profil Utilisateur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Numéro de téléphone</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+223 XX XX XX XX"
                className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Adresse Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-[#333333] pb-2 text-white">Sécurité</h2>
          <div className="space-y-4">
            <button type="button" className="bg-[#333333] hover:bg-[#444444] text-white py-2.5 px-6 rounded-lg transition-colors text-sm font-medium">
              Changer le mot de passe
            </button>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
