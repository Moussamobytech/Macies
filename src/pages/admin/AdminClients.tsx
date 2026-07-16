import { Download, User } from 'lucide-react';

export function AdminClients() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Base Clients</h1>
        </div>
        <button className="bg-[#333333] hover:bg-[#444444] text-white py-2 px-4 rounded-lg flex items-center gap-2">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden p-8 text-center">
        <User size={48} className="mx-auto text-gray-500 mb-4" />
        <p className="text-gray-400">Interface de gestion des clients en cours de développement.</p>
      </div>
    </div>
  );
}
