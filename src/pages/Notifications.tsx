import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "Commande Livrée",
      description: "Votre commande #MAC-001 (CV Professionnel) est prête. Vous pouvez télécharger le livrable.",
      time: "Il y a 2 heures",
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
      unread: true
    },
    {
      id: 2,
      title: "Demande en cours de traitement",
      description: "Votre demande de conception de logo a été assignée à un opérateur.",
      time: "Hier à 14:30",
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      unread: false
    },
    {
      id: 3,
      title: "Rappel de paiement",
      description: "N'oubliez pas de régler votre abonnement annuel pour le logiciel de gestion.",
      time: "Il y a 3 jours",
      icon: AlertCircle,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      unread: false
    }
  ];

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-400">Suivez les mises à jour de vos demandes et de votre compte.</p>
        </div>
        <button className="text-[#D4AF37] hover:underline text-sm font-medium">
          Tout marquer comme lu
        </button>
      </div>

      <div className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-6 border-b border-[#333333] last:border-0 flex gap-4 transition-colors hover:bg-[#1A1A1A] ${notif.unread ? 'bg-[#1A1A1A]/50' : ''}`}
          >
            <div className={`mt-1 p-3 rounded-full shrink-0 h-fit ${notif.bg} ${notif.color}`}>
              <notif.icon size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold ${notif.unread ? 'text-white' : 'text-gray-300'}`}>
                  {notif.title}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{notif.time}</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{notif.description}</p>
            </div>
            {notif.unread && (
              <div className="shrink-0 flex items-center justify-center w-4">
                <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
