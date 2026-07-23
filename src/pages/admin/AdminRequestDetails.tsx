import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../../services/api';
import { ArrowLeft, Clock, CheckCircle, Package, FileText, AlertCircle, MessageCircle, Send, User } from 'lucide-react';

export function AdminRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reqData, msgData] = await Promise.all([
          fetchApi(`/requests/all`), // We can just fetch all and find it, or we should probably have an admin endpoint for a single request. Let's just find it from all.
          fetchApi(`/requests/${id}/messages`)
        ]);
        const foundReq = reqData.find((r: any) => r.id === id);
        if (!foundReq) throw new Error('Demande introuvable');
        setRequest(foundReq);
        setMessages(msgData);
      } catch (err: any) {
        setError(err.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadData();
    }
  }, [id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const msg = await fetchApi(`/requests/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      });
      setMessages([...messages, msg]);
      setNewMessage('');
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'envoi");
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Chargement...</div>;
  }

  if (error || !request) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/admin/requests')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Retour
        </button>
        <div className="p-12 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/requests')} className="p-2 bg-[#1A1A1A] hover:bg-[#333333] border border-[#333333] rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold mb-1 text-white">Gestion de la demande</h1>
          <p className="text-gray-400 font-mono text-sm">#MAC-{request.id.substring(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 shadow-xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-[#D4AF37]" /> Informations Client
            </h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500">Nom:</span> {request.user?.name}</p>
              <p><span className="text-gray-500">Email:</span> {request.user?.email}</p>
              <p><span className="text-gray-500">Tél:</span> {request.user?.phone}</p>
              <p><span className="text-gray-500">Date:</span> {new Date(request.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          
          <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 shadow-xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={18} className="text-[#D4AF37]" /> Détails Demande
            </h3>
            <p className="font-semibold text-white mb-2">{request.type}</p>
            <p className="text-sm text-gray-400 whitespace-pre-wrap">{request.description}</p>
            
            {request.fileUrl && (
              <div className="mt-4 pt-4 border-t border-[#333333]">
                <a href={request.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#D4AF37] hover:underline">
                  Voir la pièce jointe
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* Chat Section */}
          <div className="bg-[#111111] border border-[#333333] rounded-xl shadow-xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-[#333333] bg-[#1A1A1A] flex items-center gap-3">
              <MessageCircle className="text-[#D4AF37]" size={24} />
              <h3 className="font-bold text-white">Discussion avec le client</h3>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-black/20">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center text-sm mt-4">Aucun message. Commencez la discussion !</p>
              ) : (
                messages.map((msg: any) => {
                  const isMine = msg.sender.role === 'ADMIN';
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-4 ${isMine ? 'bg-[#D4AF37] text-black rounded-tr-sm' : 'bg-[#1A1A1A] border border-[#333333] text-white rounded-tl-sm'}`}>
                        <div className="flex items-baseline justify-between gap-4 mb-1">
                          <span className="font-bold text-sm opacity-80">{isMine ? 'Moi (Admin)' : msg.sender.name}</span>
                          <span className="text-xs opacity-60">
                            {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-[#1A1A1A] border-t border-[#333333] flex gap-3">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Répondre au client..." 
                className="flex-1 bg-[#111111] border border-[#333333] rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim() || sendingMessage}
                className="w-12 h-12 bg-[#D4AF37] hover:bg-[#c29e2f] text-black rounded-full flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
