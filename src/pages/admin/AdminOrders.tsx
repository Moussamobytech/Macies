import { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Clock, Package } from 'lucide-react';
import { fetchApi } from '../../services/api';

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await fetchApi('/orders/all');
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDeliver = async (orderId: string) => {
    try {
      await fetchApi(`/orders/${orderId}/deliver`, {
        method: 'PATCH'
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus: 'PAID' } : o));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Chargement des commandes...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ShoppingCart className="text-[#D4AF37]" /> Commandes Logicielles
        </h1>
        <p className="text-gray-400">Gérez et livrez les achats de logiciels de vos clients.</p>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#333333] bg-[#111111]">
          <h2 className="font-semibold text-white">Liste des commandes</h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucune commande pour le moment.</div>
        ) : (
          <div className="divide-y divide-[#333333]">
            {orders.map((order) => (
              <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-[#111111]">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#333333] rounded-lg shrink-0 mt-1">
                    <Package className="text-[#D4AF37]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{order.softwareName}</h3>
                    <div className="text-sm text-gray-400 mt-1 flex flex-col gap-1">
                      <span><strong className="text-gray-300">Client :</strong> {order.user?.name} ({order.user?.email})</span>
                      <span><strong className="text-gray-300">Date :</strong> {new Date(order.createdAt).toLocaleString('fr-FR')}</span>
                      <span><strong className="text-gray-300">Prix :</strong> <span className="text-[#D4AF37]">{order.price}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${
                    order.paymentStatus === 'PAID' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                  }`}>
                    {order.paymentStatus === 'PAID' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {order.paymentStatus === 'PAID' ? 'LIVRÉE' : 'EN ATTENTE'}
                  </span>

                  {order.paymentStatus !== 'PAID' && (
                    <button 
                      onClick={() => handleDeliver(order.id)}
                      className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
                    >
                      <CheckCircle size={16} /> Livrer la commande
                    </button>
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
