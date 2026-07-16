import { FileText, Users, DollarSign } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { label: 'Demandes à traiter', value: '14', icon: FileText, color: 'text-orange-400' },
    { label: 'Clients Actifs', value: '128', icon: Users, color: 'text-blue-400' },
    { label: 'Chiffre d\'Affaires (Mois)', value: '450K FCFA', icon: DollarSign, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vue d'ensemble</h1>
        <p className="text-gray-400">Supervisez l'activité globale de MACIES PORTAL.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1A1A1A] border border-[#333333] p-6 rounded-xl flex items-center gap-4">
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
    </div>
  );
}
