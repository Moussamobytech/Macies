import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { fetchApi } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (token) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password }),
      });
      setAuth(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white font-sans animate-in fade-in duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold tracking-wider">
          MACIES <span className="text-[#D4AF37]">PORTAL</span>
        </h1>
        <h2 className="mt-6 text-center text-xl font-medium text-gray-300">
          Créer un nouveau compte
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1A1A1A] py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-[#333333]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom Complet</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 bg-[#111111] border border-[#333333] rounded-lg py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Amadou Traoré" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Adresse Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 bg-[#111111] border border-[#333333] rounded-lg py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="vous@exemple.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full pl-10 bg-[#111111] border border-[#333333] rounded-lg py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="+223 XX XX XX XX" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 bg-[#111111] border border-[#333333] rounded-lg py-3 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black bg-[#D4AF37] hover:bg-[#c29e2f] focus:outline-none transition-colors items-center gap-2 disabled:opacity-50">
              {loading ? 'Création...' : 'Créer mon compte'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#333333]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1A1A1A] text-gray-400">Déjà inscrit ?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login" className="w-full flex justify-center py-3 px-4 border border-[#333333] rounded-lg shadow-sm text-sm font-medium text-white bg-transparent hover:bg-[#333333] transition-colors">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
