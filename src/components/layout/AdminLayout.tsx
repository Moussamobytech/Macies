import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings2, Activity, Bell, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
    { to: '/admin/requests', icon: FileText, label: 'Gestion Demandes' },
    { to: '/admin/clients', icon: Users, label: 'Base Clients' },
    { to: '/admin/pricing', icon: Settings2, label: 'Tarification' },
    { to: '/admin/logs', icon: Activity, label: 'Logs Système' },
  ];

  return (
    <aside className="w-full h-full bg-[#0a0a0a] border-r border-[#333333] flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider text-white">
          MACIES <span className="text-red-500">ADMIN</span>
        </h1>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-red-500/10 text-red-500'
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

function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-20 border-b border-[#333333] flex items-center justify-between px-4 md:px-8 bg-[#111111]">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        )}
        <h2 className="text-lg font-medium text-gray-300 hidden md:block">Mode Administrateur</h2>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center group-hover:bg-[#444444] transition-colors">
            <User size={20} className="text-red-500" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#111111] text-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
