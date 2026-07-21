import { Activity, Clock, CheckCircle, RefreshCw, AlertCircle, FileEdit, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';

export function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/admin/logs');
      setLogs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getLogIcon = (action: string) => {
    switch (action) {
      case 'STATUS_UPDATE':
        return <RefreshCw size={18} className="text-blue-500" />;
      case 'DELIVERY':
        return <Truck size={18} className="text-green-500" />;
      case 'SYSTEM':
        return <Activity size={18} className="text-purple-500" />;
      default:
        return <FileEdit size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Activity className="text-[#D4AF37]" /> Logs d'activité</h1>
          <p className="text-gray-400">Traçabilité complète des actions effectuées sur le panel.</p>
        </div>
        <button onClick={loadLogs} className="bg-[#333333] hover:bg-[#444444] text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Actualiser
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden p-6 shadow-xl min-h-[400px]">
        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 flex items-center gap-2 border border-red-500/20 rounded-lg mb-6">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {loading && logs.length === 0 ? (
          <div className="text-center text-gray-500 py-12 flex flex-col items-center gap-4">
            <RefreshCw size={32} className="animate-spin text-[#333333]" />
            Chargement de l'historique...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-500 py-12 flex flex-col items-center gap-4">
            <Activity size={48} className="text-[#333333]" />
            <p>Aucun log enregistré pour le moment.</p>
            <p className="text-sm">Les actions des administrateurs apparaîtront ici.</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#333333] before:to-transparent">
            {logs.map((log) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1A1A1A] bg-[#111111] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                  {getLogIcon(log.action)}
                </div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111111] p-4 rounded-xl border border-[#333333] shadow-md transition-colors hover:border-[#D4AF37]/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <span className="font-bold text-white flex items-center gap-2 text-sm">
                      {log.user?.name || 'Administrateur inconnu'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1 font-mono bg-[#1A1A1A] px-2 py-1 rounded">
                      <Clock size={12} />
                      {new Date(log.createdAt).toLocaleString('fr-FR', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="text-gray-300 text-sm mt-2 font-medium">
                    {log.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
