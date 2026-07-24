import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { MessageSquare, Send, User, Search } from 'lucide-react';

export function AdminMessages() {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchApi('/requests/all');
        // Sort by creation date or eventually latest message
        setRequests(data);
        if (data.length > 0 && !selectedRequestId) {
          setSelectedRequestId(data[0].id);
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedRequestId) return;
      try {
        const data = await fetchApi(`/requests/${selectedRequestId}/messages`);
        setMessages(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };
    loadMessages();
  }, [selectedRequestId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage || !selectedRequestId) return;

    setSendingMessage(true);
    try {
      const msg = await fetchApi(`/requests/${selectedRequestId}/messages`, {
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

  const filteredRequests = requests.filter(req => 
    req.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (req.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Chargement de la messagerie...</div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      {/* Sidebar - Liste des conversations */}
      <div className={`${selectedRequestId ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 bg-[#111111] border border-[#333333] rounded-xl shadow-xl flex-col overflow-hidden`}>
        <div className="p-4 border-b border-[#333333] bg-[#1A1A1A]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="text-white" size={20} /> Boîte de réception
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher #ID ou Client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500">Aucune conversation trouvée.</p>
          ) : (
            <div className="divide-y divide-[#333333]">
              {filteredRequests.map(req => (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`w-full text-left p-4 hover:bg-[#1A1A1A] transition-colors flex flex-col gap-2 ${selectedRequestId === req.id ? 'bg-[#1A1A1A] border-l-2 border-red-500' : ''}`}
                >
                  <div className="flex justify-between items-start w-full gap-2">
                    <span className="font-bold text-sm text-white truncate">{req.user?.name || 'Client inconnu'}</span>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap bg-[#111111] px-1.5 py-0.5 rounded border border-[#333333]">
                      #MAC-{req.id.substring(0,4).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 line-clamp-1">{req.type}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!selectedRequestId ? 'hidden md:flex' : 'flex'} flex-1 w-full md:w-2/3 bg-[#111111] border border-[#333333] rounded-xl shadow-xl flex-col overflow-hidden`}>
        {selectedRequestId ? (
          <>
            <div className="p-4 border-b border-[#333333] bg-[#1A1A1A] flex flex-col">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedRequestId(null)}
                    className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <User size={18} className="text-red-500" /> 
                    {selectedRequest?.user?.name || 'Client inconnu'}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1 pl-10 md:pl-0">{selectedRequest?.user?.email}</p>
              <div className="mt-3 text-sm text-gray-300 bg-[#333333]/50 px-3 py-1.5 rounded-lg inline-block self-start border border-[#333333]">
                Demande : <span className="font-semibold text-white">{selectedRequest?.type}</span>
              </div>
            </div>
            
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-black/20">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-3">
                  <MessageSquare size={48} className="opacity-20 text-red-500" />
                  <p className="text-center px-4">Aucun message. Commencez à discuter avec ce client.</p>
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isMine = msg.sender.role === 'ADMIN';
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-4 ${isMine ? 'bg-[#333333] text-white rounded-tr-sm border border-[#444444]' : 'bg-[#1A1A1A] border border-[#333333] text-white rounded-tl-sm'}`}>
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

            <form onSubmit={sendMessage} className="p-3 md:p-4 bg-[#1A1A1A] border-t border-[#333333] flex gap-2 md:gap-3">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Répondre au client..." 
                className="flex-1 bg-[#111111] border border-[#333333] rounded-full px-4 md:px-5 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim() || sendingMessage}
                className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="hidden md:flex h-full flex-col items-center justify-center text-gray-500 space-y-4">
            <MessageSquare size={48} className="opacity-20 text-red-500" />
            <p>Sélectionnez une demande à gauche pour voir les messages.</p>
          </div>
        )}
      </div>
    </div>
  );
}
