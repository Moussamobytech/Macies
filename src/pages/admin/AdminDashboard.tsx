import { FileText, Users, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';

export function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    pendingRequests: 0,
    activeClients: 0,
    deliveredRequests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/admin/stats')
      .then(data => {
        setStatsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: 'Demandes à traiter (En attente/En cours)', value: loading ? '...' : statsData.pendingRequests.toString(), icon: FileText, color: 'text-orange-400' },
    { label: 'Clients Actifs', value: loading ? '...' : statsData.activeClients.toString(), icon: Users, color: 'text-blue-400' },
    { label: 'Commandes Livrées', value: loading ? '...' : statsData.deliveredRequests.toString(), icon: CheckCircle, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vue d'ensemble</h1>
        <p className="text-gray-400">Supervisez l'activité globale de MACIES PORTAL.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1A1A1A] border border-[#333333] p-6 rounded-xl flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`p-4 rounded-lg bg-black/50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
