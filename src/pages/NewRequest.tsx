import { Upload, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { fetchApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function NewRequest() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !description) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await fetchApi('/requests', {
        method: 'POST',
        body: JSON.stringify({ type, description }),
      });
      setSuccess(true);
      setTimeout(() => navigate('/requests'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center p-12 bg-[#111111] border border-[#333333] rounded-xl text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Demande envoyée avec succès !</h2>
        <p className="text-gray-400">Vous allez être redirigé vers le suivi de vos demandes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nouvelle Demande</h1>
        <p className="text-gray-400">Remplissez ce formulaire pour nous soumettre une nouvelle demande de service.</p>
      </div>

      <form className="bg-[#111111] border border-[#333333] rounded-xl p-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type de service *</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
            >
              <option value="">Sélectionnez un service...</option>
              <option value="Aide à la rédaction">Aide à la rédaction (CV, Lettre...)</option>
              <option value="Édition et mise en page">Édition et mise en page</option>
              <option value="Achat de logiciel professionnel">Achat de logiciel professionnel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description détaillée *</label>
            <textarea 
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              placeholder="Décrivez précisément votre besoin..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fichiers joints (Optionnel)</label>
            <div className="border-2 border-dashed border-[#333333] rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-[#1A1A1A]/50 hover:border-[#D4AF37]/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors">
                <Upload className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" size={24} />
              </div>
              <p className="font-medium text-gray-300 mb-1">Cliquez pour ajouter des fichiers</p>
              <p className="text-sm text-gray-500">PDF, Word, Images jusqu'à 50 Mo</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#333333] flex justify-end">
          <button type="submit" disabled={loading} className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50">
            {loading ? 'Envoi...' : 'Valider la demande'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}
