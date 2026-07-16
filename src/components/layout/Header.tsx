import { Bell, User, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-20 border-b border-[#333333] flex items-center justify-between px-4 md:px-8 bg-[#1A1A1A]">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        )}
        <h2 className="text-lg font-medium text-gray-300 hidden md:block">Bienvenue, Utilisateur</h2>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/notifications" className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D4AF37] rounded-full"></span>
        </Link>
        <Link to="/profile" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center group-hover:bg-[#444444] transition-colors">
            <User size={20} className="text-[#D4AF37]" />
          </div>
        </Link>
      </div>
    </header>
  );
}
