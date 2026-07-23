import { Plus, Clock, CheckCircle, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi('/requests');
        setRequests(data);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = [
    { label: 'Demandes en cours', value: requests.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length.toString(), icon: Clock, color: 'text-blue-400' },
    { label: 'Terminées', value: requests.filter(r => r.status === 'DELIVERED').length.toString(), icon: CheckCircle, color: 'text-green-400' },
    { label: 'Commandes archivées', value: requests.length.toString(), icon: Package, color: 'text-[#D4AF37]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-gray-400">Suivez l'avancement de vos demandes et commandes.</p>
        </div>
        <Link to="/requests/new" className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Nouvelle Demande
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111111] border border-[#333333] p-6 rounded-xl flex items-center gap-4 transition-transform hover:-translate-y-1 hover:border-[#D4AF37]/30">
            <div className={`p-4 rounded-lg bg-black/50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#333333] flex justify-between items-center">
          <h2 className="text-xl font-semibold">Demandes Récentes</h2>
          <Link to="/requests" className="text-[#D4AF37] hover:text-[#c29e2f] text-sm font-medium">Voir tout</Link>
        </div>
        <div className="p-0">
          {loading ? (
            <p className="text-gray-400 text-center py-8">Chargement...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Vous n'avez aucune demande récente pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {requests.slice(0, 5).map(req => (
                    <tr key={req.id} className="border-b border-[#333333] hover:bg-[#1A1A1A]">
                      <td className="p-4 text-sm font-mono text-gray-400">#MAC-{req.id.substring(0, 4).toUpperCase()}</td>
                      <td className="p-4 text-sm font-medium">{req.type}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          req.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                          req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4 text-right">
                        {req.status === 'DELIVERED' && req.deliverableUrl && (
                          <div className="flex flex-col items-end gap-2">
                            {(() => {
                              try {
                                if (req.deliverableUrl.startsWith('{')) {
                                  const data = JSON.parse(req.deliverableUrl);
                                  return (
                                    <div className="flex flex-col items-end gap-2">
                                      <a 
                                        href={data.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs bg-[#D4AF37] hover:bg-[#c29e2f] text-black px-3 py-1.5 rounded font-bold transition-colors inline-block text-center"
                                      >
                                        Télécharger Logiciel
                                      </a>
                                      {data.key && (
                                        <div className="bg-[#111111] border border-[#333333] px-3 py-1.5 rounded flex items-center gap-2 mt-1 shadow-sm">
                                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Clé :</span>
                                          <code className="text-xs text-[#D4AF37] font-mono font-bold select-all">{data.key}</code>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              } catch (e) {}
                              
                              // Fallback pour les fichiers (non JSON)
                              return (
                                <a 
                                  href={req.deliverableUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs bg-[#D4AF37] hover:bg-[#c29e2f] text-black px-3 py-1.5 rounded font-bold transition-colors inline-block"
                                >
                                  Télécharger Livrable
                                </a>
                              );
                            })()}
                            <span className="text-[10px] text-gray-400 italic">Veuillez régler en boutique ou via mobile money.</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
