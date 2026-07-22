import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Activity, 
  Bell, 
  User, 
  Menu, 
  X, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { fetchApi } from '../../services/api';

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
    { to: '/admin/requests', icon: FileText, label: 'Gestion Demandes' },
    { to: '/admin/clients', icon: Users, label: 'Base Clients' },
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchApi('/notifications')
        .then(data => {
          const unread = data.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 border-b border-[#333333] flex items-center justify-between px-4 md:px-8 bg-[#111111]">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        )}
        <h2 className="text-lg font-medium text-gray-300 hidden md:block">
          Mode Administrateur ({user?.name?.split(' ')[0] || 'Admin'})
        </h2>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/admin/notifications" className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[16px] min-h-[16px]">
              {unreadCount}
            </span>
          )}
        </Link>
        <div className="relative" ref={menuRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center group-hover:bg-[#444444] transition-colors">
              <User size={20} className="text-red-500" />
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#333333] rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-[#333333]">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link 
                  to="/admin/settings" 
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-white transition-colors"
                >
                  <Settings size={16} /> Paramètres
                </Link>
              </div>
              <div className="py-1 border-t border-[#333333]">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

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
