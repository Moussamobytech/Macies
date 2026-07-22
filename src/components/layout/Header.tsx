import { Bell, User, Menu, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { fetchApi } from '../../services/api';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      fetchApi('/notifications')
        .then(data => {
          const unread = data.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 border-b border-[#333333] flex items-center justify-between px-4 md:px-8 bg-[#1A1A1A]">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        )}
        <h2 className="text-lg font-medium text-gray-300 hidden md:block">
          Bienvenue, {user?.name?.split(' ')[0] || 'Utilisateur'}
        </h2>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/notifications" className="relative text-gray-400 hover:text-white transition-colors">
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
              <User size={20} className="text-[#D4AF37]" />
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-[#333333] rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-[#333333]">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link 
                  to="/settings" 
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
