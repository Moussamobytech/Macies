import { ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';

export function Orders() {
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  const softwares = [
    { id: 1, name: "Suite Microsoft Office 2024", type: "Licence à vie", price: "25 000 FCFA" },
    { id: 2, name: "Logiciel de Gestion Comptable Pro", type: "Abonnement Annuel", price: "75 000 FCFA" },
    { id: 3, name: "Antivirus Premium", type: "1 Poste - 1 An", price: "15 000 FCFA" }
  ];

  const fetchMyOrders = async () => {
    try {
      const data = await fetchApi('/orders/my-orders');
      setMyOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleOrder = async (software: typeof softwares[0]) => {
    setLoading(true);
    setStatusMsg(null);
    try {
      await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify({
          softwareName: software.name,
          price: software.price
        })
      });
      setStatusMsg({ type: 'success', text: `Votre commande pour ${software.name} a été prise en compte !` });
      fetchMyOrders();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Erreur lors de la commande' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vente de Logiciels</h1>
        <p className="text-gray-400">Achetez et téléchargez vos logiciels professionnels.</p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-lg flex items-center gap-2 border ${statusMsg.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          <CheckCircle size={18} /> {statusMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {softwares.map(soft => (
          <div key={soft.id} className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:border-[#D4AF37]/30">
            <div className="h-32 bg-[#1A1A1A] flex items-center justify-center border-b border-[#333333]">
              <ShoppingCart size={40} className="text-[#D4AF37]/50" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-1">{soft.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{soft.type}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xl font-bold text-[#D4AF37]">{soft.price}</span>
                <button 
                  onClick={() => handleOrder(soft)}
                  disabled={loading}
                  className="bg-[#333333] hover:bg-[#444444] text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  Commander
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-[#333333] rounded-xl mt-8">
        <div className="p-6 border-b border-[#333333]">
          <h2 className="text-xl font-semibold">Mes Logiciels Achetés</h2>
        </div>
        <div className="p-6">
          {myOrders.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Vous n'avez acheté aucun logiciel pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {myOrders.map(order => (
                <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#1A1A1A] border border-[#333333] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#333333] flex items-center justify-center text-[#D4AF37]">
                      <Package size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{order.softwareName}</h4>
                      <p className="text-sm text-gray-400">Commandé le {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <span className="font-bold text-white">{order.price}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-orange-500/20 text-orange-500 border-orange-500/30'}`}>
                      {order.paymentStatus === 'PAID' ? 'LIVRÉ' : 'EN TRAITEMENT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
