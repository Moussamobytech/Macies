import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, ShoppingCart, Settings, X, MessageSquare } from 'lucide-react';

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/requests', icon: FileText, label: 'Mes demandes' },
    { to: '/orders', icon: ShoppingCart, label: 'Mes commandes' },
    { to: '/messages', icon: MessageSquare, label: 'Messagerie' },
    { to: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <aside className="w-full h-full bg-[#111111] border-r border-[#333333] flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider">
          MACIES <span className="text-[#D4AF37]">PORTAL</span>
        </h1>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-white/10 text-[#D4AF37]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
