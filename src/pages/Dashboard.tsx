import { Plus, Clock, CheckCircle, Package } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Demandes en cours', value: '2', icon: Clock, color: 'text-blue-400' },
    { label: 'Livrées ce mois', value: '5', icon: CheckCircle, color: 'text-green-400' },
    { label: 'Total Commandes', value: '12', icon: Package, color: 'text-[#D4AF37]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-gray-400">Suivez l'avancement de vos demandes et commandes.</p>
        </div>
        <button className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Nouvelle Demande
        </button>
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
          <button className="text-[#D4AF37] hover:text-[#c29e2f] text-sm font-medium">Voir tout</button>
        </div>
        <div className="p-6">
          <p className="text-gray-400 text-center py-8">Vous n'avez aucune demande récente pour le moment.</p>
        </div>
      </div>
    </div>
  );
}
