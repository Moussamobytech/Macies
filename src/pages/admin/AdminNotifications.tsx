import { CheckCircle, Bell, AlertCircle, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await fetchApi('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetchApi(`/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetchApi('/notifications/read-all', { method: 'PATCH' });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Bell className="text-[#D4AF37]" /> Notifications Admin</h1>
          <p className="text-gray-400">Suivi des nouvelles demandes et commandes.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="bg-[#333333] hover:bg-[#444444] text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
        >
          Tout marquer comme lu
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#333333] bg-[#111111]">
          <h2 className="font-semibold text-white">Activité Récente</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucune notification trouvée.</div>
        ) : (
          <div className="divide-y divide-[#333333]">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-6 flex gap-4 transition-colors hover:bg-[#111111] ${!notif.isRead ? 'bg-[#111111]/50' : ''}`}
              >
                <div className={`mt-1 p-3 rounded-full shrink-0 h-fit ${!notif.isRead ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-800 text-gray-400'}`}>
                  {!notif.isRead ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold ${!notif.isRead ? 'text-white' : 'text-gray-300'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {new Date(notif.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{notif.message}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {!notif.isRead && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 text-gray-400 hover:text-white bg-[#333333] hover:bg-[#444444] rounded-lg transition-colors"
                      title="Marquer comme lu"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
