import { Download, Users, AlertCircle, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';

export function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApi('/admin/clients')
      .then(data => {
        setClients(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Users className="text-[#D4AF37]" /> Base Clients</h1>
          <p className="text-gray-400">Liste des utilisateurs inscrits sur la plateforme.</p>
        </div>
        <button className="bg-[#333333] hover:bg-[#444444] text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden">
        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 flex items-center gap-2 border-b border-[#333333]">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#333333] text-gray-400 text-sm">
                <th className="p-4 font-medium">Nom complet</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Date d'inscription</th>
                <th className="p-4 font-medium text-center">Commandes passées</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Chargement des clients...</td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Aucun client trouvé.</td></tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-[#333333] hover:bg-[#111111] transition-colors">
                    <td className="p-4 font-medium">{client.name}</td>
                    <td className="p-4 text-sm text-gray-400 space-y-1">
                      <div className="flex items-center gap-2"><Mail size={14} className="text-[#D4AF37]" /> {client.email}</div>
                      <div className="flex items-center gap-2"><Phone size={14} className="text-[#D4AF37]" /> {client.phone}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(client.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold border border-[#D4AF37]/30">
                        {client._count?.requests || 0}
                      </span>
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
