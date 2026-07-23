import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../services/api';
import { ArrowLeft, Clock, CheckCircle, Package, Download, AlertCircle, FileText, MessageCircle } from 'lucide-react';

export function RequestDetails() {
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
          fetchApi(`/requests/${id}`),
          fetchApi(`/requests/${id}/messages`)
        ]);
        setRequest(reqData);
        setMessages(msgData);
      } catch (err: any) {
        setError(err.message || 'Demande introuvable');
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
    return <div className="p-12 text-center text-gray-500">Chargement des détails...</div>;
  }

  if (error || !request) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Retour
        </button>
        <div className="p-12 text-center flex flex-col items-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Erreur</h3>
          <p className="text-gray-400">{error || 'Demande non trouvée.'}</p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'PENDING', label: 'En attente', icon: Clock },
    { key: 'IN_PROGRESS', label: 'En cours', icon: FileText },
    { key: 'VALIDATED', label: 'Validée', icon: CheckCircle },
    { key: 'DELIVERED', label: 'Livrée', icon: Package },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === request.status);
  const isArchived = request.status === 'ARCHIVED';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/requests')} className="p-2 bg-[#1A1A1A] hover:bg-[#333333] border border-[#333333] rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-1 text-white">Détails de la demande</h1>
            <p className="text-gray-400 font-mono text-sm">#MAC-{request.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>
        {isArchived && (
          <span className="px-3 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-full text-xs font-bold">
            ARCHIVÉE
          </span>
        )}
      </div>

      <div className="bg-[#111111] border border-[#333333] rounded-xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#333333]">
          <h2 className="text-xl font-bold text-[#D4AF37] mb-2">{request.type}</h2>
          <p className="text-gray-300">{request.description}</p>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>Créée le {new Date(request.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Timeline Status */}
        {!isArchived && (
          <div className="p-8 border-b border-[#333333] bg-[#1A1A1A]/50">
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Suivi de la commande</h3>
            <div className="relative">
              <div className="absolute top-5 left-0 w-full h-1 bg-[#333333] -z-10 rounded"></div>
              <div 
                className="absolute top-5 left-0 h-1 bg-[#D4AF37] -z-10 rounded transition-all duration-500"
                style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
              ></div>
              
              <div className="flex justify-between">
                {steps.map((step, index) => {
                  const isCompleted = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#111111] transition-colors ${
                        isCompleted ? 'bg-[#D4AF37] text-black' : 'bg-[#333333] text-gray-500'
                      } ${isCurrent ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#1A1A1A]' : ''}`}>
                        <step.icon size={18} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        isCurrent ? 'text-[#D4AF37]' : isCompleted ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Deliverable Section */}
        {request.deliverableUrl && (
          <div className="p-6 bg-[#D4AF37]/5 border-t border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                Votre commande est prête !
              </h3>
              <p className="text-sm text-gray-400 mt-1">Vous pouvez télécharger votre fichier ou logiciel final ci-dessous.</p>
            </div>
            
            {(() => {
              try {
                if (request.deliverableUrl.startsWith('{')) {
                  const data = JSON.parse(request.deliverableUrl);
                  return (
                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                      <a 
                        href={data.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full md:w-auto bg-[#D4AF37] hover:bg-[#c29e2f] text-black px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={20} /> Télécharger Logiciel
                      </a>
                      {data.key && (
                        <div className="bg-[#111111] border border-[#333333] px-4 py-2 rounded-lg flex items-center gap-2 w-full md:w-auto shadow-sm">
                          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Clé :</span>
                          <code className="text-sm text-[#D4AF37] font-mono font-bold select-all">{data.key}</code>
                        </div>
                      )}
                    </div>
                  );
                }
              } catch (e) {}
              
              return (
                <a 
                  href={request.deliverableUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto bg-[#D4AF37] hover:bg-[#c29e2f] text-black px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Télécharger le livrable
                </a>
              );
            })()}
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="bg-[#111111] border border-[#333333] rounded-xl shadow-xl overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-[#333333] bg-[#1A1A1A] flex items-center gap-3">
          <MessageCircle className="text-[#D4AF37]" size={24} />
          <h3 className="font-bold text-white">Messagerie avec MACIES</h3>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-black/20">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center text-sm mt-4">Aucun message pour le moment. Vous pouvez discuter avec l'opérateur ici.</p>
          ) : (
            messages.map((msg: any) => {
              const isMine = msg.sender.role !== 'ADMIN';
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${isMine ? 'bg-[#D4AF37] text-black rounded-tr-sm' : 'bg-[#1A1A1A] border border-[#333333] text-white rounded-tl-sm'}`}>
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                      <span className="font-bold text-sm opacity-80">{isMine ? 'Moi' : 'MACIES'}</span>
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
            placeholder="Écrivez votre message..." 
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
  );
}

import { MessageCircle, Send } from 'lucide-react';
