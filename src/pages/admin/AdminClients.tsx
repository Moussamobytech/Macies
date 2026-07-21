import { Download, Users, AlertCircle, Phone, Mail, Search, Eye, MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';

export function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

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

  // Filtrage
  const filteredClients = clients.filter(client => {
    const query = searchQuery.toLowerCase();
    return (client.name || '').toLowerCase().includes(query) || 
           (client.email || '').toLowerCase().includes(query) ||
           (client.phone || '').includes(query);
  });

  // Export CSV
  const exportCSV = () => {
    if (filteredClients.length === 0) return alert("Aucune donnée à exporter.");
    
    const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Date Inscription', 'Commandes passées'];
    const csvContent = [
      headers.join(','),
      ...filteredClients.map(c => {
        return [
          c.id,
          `"${c.name}"`,
          `"${c.email}"`,
          `"${c.phone}"`,
          new Date(c.createdAt).toLocaleDateString('fr-FR'),
          c._count?.requests || 0
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_macies_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppReminder = (phone: string, name: string) => {
    // Format number (remove + or spaces if needed, but WhatsApp usually handles it well)
    const formattedPhone = phone.replace(/\D/g, ''); 
    const message = encodeURIComponent(`Bonjour ${name}, c'est l'équipe MACIES PORTAL. Nous revenons vers vous suite à votre inscription sur notre plateforme. Comment pouvons-nous vous aider aujourd'hui ?`);
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Users className="text-[#D4AF37]" /> Base Clients</h1>
          <p className="text-gray-400">Liste des utilisateurs inscrits sur la plateforme.</p>
        </div>
        <button onClick={exportCSV} className="bg-[#333333] hover:bg-[#444444] text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden shadow-xl">
        {/* Barre de recherche */}
        <div className="p-4 border-b border-[#333333] flex justify-between items-center bg-[#111111]">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 bg-[#1A1A1A] border border-[#333333] rounded-lg py-2 text-sm text-white focus:border-red-500 focus:outline-none transition-colors" 
              placeholder="Rechercher par nom, email ou téléphone..." 
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 flex items-center gap-2 border-b border-[#333333]">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#333333] text-gray-400 text-sm bg-black/20">
                <th className="p-4 font-medium">Nom complet</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Inscription</th>
                <th className="p-4 font-medium text-center">Commandes</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chargement des clients...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aucun client trouvé.</td></tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-[#333333] hover:bg-[#111111] transition-colors">
                    <td className="p-4 font-medium text-white">{client.name}</td>
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
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedClient(client)}
                        className="p-2 bg-[#333333] hover:bg-[#444444] text-white rounded transition-colors inline-flex items-center justify-center"
                        title="Voir la fiche client"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fiche Client Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#333333] rounded-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-[#333333] flex justify-between items-center bg-[#1A1A1A]">
              <h2 className="font-bold text-lg flex items-center gap-2"><User className="text-[#D4AF37]" size={20} /> Fiche Client</h2>
              <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-2xl font-bold text-[#D4AF37]">
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedClient.name}</h3>
                  <p className="text-sm text-gray-400">Client depuis le {new Date(selectedClient.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333333]">
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</span>
                  <div className="text-sm font-medium flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {selectedClient.email}</div>
                </div>
                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333333]">
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Téléphone</span>
                  <div className="text-sm font-medium flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {selectedClient.phone}</div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333333] flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Total des commandes</span>
                  <div className="text-2xl font-bold text-[#D4AF37]">{selectedClient._count?.requests || 0}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#333333] flex flex-col gap-3">
                <button 
                  onClick={() => handleWhatsAppReminder(selectedClient.phone, selectedClient.name)}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={20} />
                  Relancer sur WhatsApp
                </button>
                <button 
                  onClick={() => setSelectedClient(null)} 
                  className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white font-medium px-4 py-3 rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// Adding missing User import that is required for the icon
import { User } from 'lucide-react';
