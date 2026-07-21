import { Search, Download, Upload, AlertCircle, X, Key, LayoutGrid, List as ListIcon, Filter } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '../../services/api';
import { upload } from '@vercel/blob/client';

export function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

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

  // Filtrage
  const filteredRequests = requests.filter(req => {
    const searchMatch = req.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (req.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = filterType === 'ALL' || req.type === filterType;
    const statusMatch = filterStatus === 'ALL' || req.status === filterStatus;
    return searchMatch && typeMatch && statusMatch;
  });

  // Export CSV
  const exportCSV = () => {
    if (filteredRequests.length === 0) return alert("Aucune donnée à exporter.");
    
    const headers = ['ID', 'Client', 'Type', 'Statut', 'Date Création', 'Lien Livrable'];
    const csvContent = [
      headers.join(','),
      ...filteredRequests.map(req => {
        return [
          `#MAC-${req.id.substring(0, 4).toUpperCase()}`,
          `"${req.user?.name || 'Inconnu'}"`,
          `"${req.type}"`,
          req.status,
          new Date(req.createdAt).toLocaleDateString('fr-FR'),
          `"${req.deliverableUrl ? req.deliverableUrl.replace(/"/g, '""') : ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `commandes_macies_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Demandes</h1>
          <p className="text-gray-400">Gérez, assignez et suivez les demandes clients.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-[#1A1A1A] border border-[#333333] rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#333333] text-white' : 'text-gray-400 hover:text-white'}`}
              title="Vue en grille"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#333333] text-white' : 'text-gray-400 hover:text-white'}`}
              title="Vue en liste"
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button onClick={exportCSV} className="bg-[#333333] hover:bg-[#444444] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors flex-1 md:flex-none">
            <Download size={18} /> <span className="hidden md:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden shadow-xl">
        {/* Barre de filtres */}
        <div className="p-4 border-b border-[#333333] flex flex-col md:flex-row justify-between items-center bg-[#111111] gap-4">
          <div className="flex gap-4 flex-1 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 bg-[#1A1A1A] border border-[#333333] rounded-lg py-2 text-sm text-white focus:border-red-500 focus:outline-none transition-colors" 
                placeholder="Rechercher #ID ou Client..." 
              />
            </div>
            
            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded-lg px-2 flex-1 md:flex-none">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border-none py-2 text-sm text-gray-300 focus:outline-none w-full cursor-pointer"
              >
                <option value="ALL">Tous les types</option>
                <option value="Achat de logiciel professionnel">Logiciel</option>
                <option value="Rédaction de CV standard">CV Standard</option>
                <option value="Rédaction de CV professionnel">CV Pro</option>
                <option value="Rédaction de lettre de motivation">Lettre de motivation</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded-lg px-2 flex-1 md:flex-none">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-none py-2 text-sm text-gray-300 focus:outline-none w-full cursor-pointer"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="VALIDATED">Validé</option>
                <option value="DELIVERED">Livré</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 flex items-center gap-2 border-b border-[#333333]">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {viewMode === 'list' ? (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#333333] text-gray-400 text-sm bg-black/20">
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
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">Chargement...</td></tr>
                ) : filteredRequests.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">Aucune demande trouvée pour ces critères.</td></tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="border-b border-[#333333] hover:bg-[#111111] transition-colors">
                      <td className="p-4 text-sm font-mono text-[#D4AF37]">#MAC-{req.id.substring(0, 4).toUpperCase()}</td>
                      <td className="p-4 text-sm font-medium">{req.user?.name || 'Inconnu'}</td>
                      <td className="p-4 text-sm text-gray-300 truncate max-w-[200px]">{req.type}</td>
                      <td className="p-4">
                        <select 
                          value={req.status}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className={`bg-[#1A1A1A] border rounded px-2 py-1 text-xs font-bold appearance-none outline-none focus:border-[#D4AF37] cursor-pointer transition-colors ${
                            req.status === 'PENDING' ? 'border-orange-500/30 text-orange-400' :
                            req.status === 'IN_PROGRESS' ? 'border-blue-500/30 text-blue-400' :
                            req.status === 'VALIDATED' ? 'border-purple-500/30 text-purple-400' :
                            'border-green-500/30 text-green-400'
                          }`}
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
                        <button onClick={() => handleDeliverClick(req)} className="p-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded transition-colors" title={req.type === 'Achat de logiciel professionnel' ? 'Livrer Licence' : 'Uploader Livrable'}>
                          {req.type === 'Achat de logiciel professionnel' ? <Key size={16} /> : <Upload size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 min-h-[400px]">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Chargement...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Aucune demande trouvée pour ces critères.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((req) => (
                  <div key={req.id} className="bg-[#111111] border border-[#333333] rounded-xl p-5 hover:border-[#D4AF37]/50 transition-colors flex flex-col h-full shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xs text-[#D4AF37] font-mono mb-1">#MAC-{req.id.substring(0, 4).toUpperCase()}</div>
                        <h3 className="font-bold text-white text-lg line-clamp-1">{req.user?.name || 'Inconnu'}</h3>
                      </div>
                      <span className="text-xs text-gray-500 bg-[#1A1A1A] border border-[#333333] px-2 py-1 rounded">
                        {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1 font-semibold">Type de demande</span>
                        <p className="text-sm text-gray-200 font-medium line-clamp-2">{req.type}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1 font-semibold">Statut actuel</span>
                        <select 
                          value={req.status}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className={`w-full bg-[#1A1A1A] border rounded-lg px-3 py-2 text-sm appearance-none outline-none focus:border-[#D4AF37] cursor-pointer transition-colors ${
                            req.status === 'PENDING' ? 'border-orange-500/30 text-orange-400 focus:border-orange-500' :
                            req.status === 'IN_PROGRESS' ? 'border-blue-500/30 text-blue-400 focus:border-blue-500' :
                            req.status === 'VALIDATED' ? 'border-purple-500/30 text-purple-400 focus:border-purple-500' :
                            'border-green-500/30 text-green-400 focus:border-green-500'
                          }`}
                        >
                          <option value="PENDING" className="text-orange-400">En attente</option>
                          <option value="IN_PROGRESS" className="text-blue-400">En cours</option>
                          <option value="VALIDATED" className="text-purple-400">Validé</option>
                          <option value="DELIVERED" className="text-green-400">Livré</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-[#333333] flex justify-end">
                      <button 
                        onClick={() => handleDeliverClick(req)} 
                        className="flex items-center gap-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-2.5 rounded-lg transition-colors text-sm font-bold w-full justify-center"
                      >
                        {req.type === 'Achat de logiciel professionnel' ? <Key size={18} /> : <Upload size={18} />}
                        {req.type === 'Achat de logiciel professionnel' ? 'Livrer la licence' : 'Uploader livrable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
