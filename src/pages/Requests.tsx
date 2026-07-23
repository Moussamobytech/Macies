import { Plus, Search, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';

export function Requests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchApi('/requests');
        setRequests(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'VALIDATED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'DELIVERED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'IN_PROGRESS': return 'En cours';
      case 'VALIDATED': return 'Validée';
      case 'DELIVERED': return 'Livrée';
      case 'ARCHIVED': return 'Archivée';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Demandes</h1>
          <p className="text-gray-400">Suivez l'état d'avancement de vos demandes en cours.</p>
        </div>
        <Link 
          to="/requests/new" 
          className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus size={20} />
          Nouvelle Demande
        </Link>
      </div>

      <div className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#333333] flex justify-between items-center bg-[#1A1A1A]">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input type="text" className="block w-full pl-10 bg-[#111111] border border-[#333333] rounded-lg py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none" placeholder="Rechercher une demande..." />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 flex items-center gap-2 border-b border-[#333333]">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement de vos demandes...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <FileText size={48} className="text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucune demande</h3>
            <p className="text-gray-400">Vous n'avez pas encore fait de demande de service.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#333333]">
            {requests.map((req) => (
              <div key={req.id} className="p-6 hover:bg-[#1A1A1A] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#333333] flex items-center justify-center shrink-0">
                    <FileText className="text-[#D4AF37]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">{req.type}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{req.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">#{req.id.split('-')[0]}</span>
                      <span className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                    {getStatusText(req.status)}
                  </span>
                  <Link to={`/requests/${req.id}`} className="text-sm text-[#D4AF37] hover:underline">
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
