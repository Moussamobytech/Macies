import { Search, Download, Upload, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '../../services/api';

export function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        body: JSON.stringify({ status: newStatus }),
      });
      loadRequests();
    } catch (err: any) {
      alert("Erreur lors de la mise à jour: " + err.message);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const handleUploadClick = (id: string) => {
    setActiveUploadId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadId) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await fetchApi(`/requests/${activeUploadId}/deliver`, {
        method: 'POST',
        body: formData
      });
      alert('Livrable envoyé avec succès!');
      loadRequests();
    } catch (err: any) {
      alert("Erreur d'upload: " + err.message);
    } finally {
      setActiveUploadId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
                      <button onClick={() => handleUploadClick(req.id)} className="p-2 hover:bg-[#333333] rounded text-blue-400 transition-colors" title="Uploader Livrable">
                        <Upload size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
