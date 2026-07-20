import { Search, Download, Upload, AlertCircle, X, Key } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '../../services/api';
import { upload } from '@vercel/blob/client';

export function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [deliveringId, setDeliveringId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Software Modal State
  const [softwareModalOpen, setSoftwareModalOpen] = useState(false);
  const [softwareLink, setSoftwareLink] = useState('');
  const [softwareKey, setSoftwareKey] = useState('');

  const loadRequests = async () => {
    try {
      const data = await fetchApi('/requests/all');
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetchApi(`/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      loadRequests();
    } catch (err: any) {
      alert("Erreur lors de la mise à jour: " + err.message);
    }
  };

  const handleDeliverClick = (req: any) => {
    setDeliveringId(req.id);
    if (req.type === 'Achat de logiciel professionnel') {
      setSoftwareModalOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleSoftwareDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveringId || !softwareLink) return;

    const deliverableData = JSON.stringify({
      link: softwareLink,
      key: softwareKey
    });

    try {
      await fetchApi(`/requests/${deliveringId}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliverableUrl: deliverableData }),
      });
      alert('Logiciel livré avec succès!');
      setSoftwareModalOpen(false);
      setSoftwareLink('');
      setSoftwareKey('');
      loadRequests();
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setDeliveringId(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !deliveringId) return;

    try {
      alert('Upload en cours... Merci de patienter.');
      const token = localStorage.getItem('macies_token') || '';
      const apiUrl = import.meta.env.VITE_API_URL || 'https://macies-backend.vercel.app/api';
      
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `${apiUrl}/requests/upload-token`,
        clientPayload: token
      });

      await fetchApi(`/requests/${deliveringId}/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliverableUrl: newBlob.url }),
      });
      
      alert('Livrable envoyé avec succès!');
      loadRequests();
    } catch (err: any) {
      alert("Erreur d'upload: " + err.message);
    } finally {
      setDeliveringId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Demandes</h1>
          <p className="text-gray-400">Gérez, assignez et suivez les demandes clients.</p>
        </div>
        <button className="bg-[#333333] hover:bg-[#444444] text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#333333] flex justify-between items-center bg-[#111111]">
          <div className="flex gap-4 flex-1">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input type="text" className="block w-full pl-10 bg-[#1A1A1A] border border-[#333333] rounded-lg py-2 text-sm text-white focus:border-red-500 focus:outline-none" placeholder="Rechercher #ID..." />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 flex items-center gap-2 border-b border-[#333333]">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#333333] text-gray-400 text-sm">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-4 text-center text-gray-500">Chargement...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-gray-500">Aucune demande trouvée.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="border-b border-[#333333] hover:bg-[#111111] transition-colors">
                    <td className="p-4 text-sm font-mono text-gray-300">#MAC-{req.id.substring(0, 4).toUpperCase()}</td>
                    <td className="p-4 text-sm">{req.user?.name || 'Inconnu'}</td>
                    <td className="p-4 text-sm text-gray-300">{req.type}</td>
                    <td className="p-4">
                      <select 
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className="bg-transparent border border-[#333333] rounded text-sm text-yellow-500 p-1"
                      >
                        <option value="PENDING">En attente</option>
                        <option value="IN_PROGRESS">En cours</option>
                        <option value="VALIDATED">Validé</option>
                        <option value="DELIVERED">Livré</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleDeliverClick(req)} className="p-2 hover:bg-[#333333] rounded text-blue-400 transition-colors" title={req.type === 'Achat de logiciel professionnel' ? 'Livrer Licence' : 'Uploader Livrable'}>
                        {req.type === 'Achat de logiciel professionnel' ? <Key size={16} /> : <Upload size={16} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Software Delivery Modal */}
      {softwareModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#333333] rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-[#333333] flex justify-between items-center bg-[#1A1A1A]">
              <h2 className="font-bold text-lg flex items-center gap-2"><Key className="text-[#D4AF37]" size={20} /> Livrer un Logiciel</h2>
              <button onClick={() => setSoftwareModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSoftwareDeliver} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lien de téléchargement *</label>
                <input 
                  type="url" 
                  required
                  value={softwareLink}
                  onChange={(e) => setSoftwareLink(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="https://mega.nz/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Clé d'activation (Optionnel)</label>
                <input 
                  type="text" 
                  value={softwareKey}
                  onChange={(e) => setSoftwareKey(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setSoftwareModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Annuler</button>
                <button type="submit" className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-bold px-6 py-2 rounded-lg transition-colors text-sm">Livrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
