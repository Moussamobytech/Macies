import { Upload, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { fetchApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { upload } from '@vercel/blob/client';

export function NewRequest() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  
  // CV fields
  const [cvCoordonnees, setCvCoordonnees] = useState('');
  const [cvExperiences, setCvExperiences] = useState('');
  const [cvCompetences, setCvCompetences] = useState('');
  
  // Software fields
  const [softwareName, setSoftwareName] = useState('Logiciel de Gestion');
  const [softwareEdition, setSoftwareEdition] = useState('Standard');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalDescription = type === 'CV professionnel' 
      ? `**Coordonnées:**\n${cvCoordonnees}\n\n**Expériences:**\n${cvExperiences}\n\n**Compétences:**\n${cvCompetences}`
      : type === 'Achat de logiciel professionnel'
      ? `**Logiciel:** ${softwareName}\n**Édition:** ${softwareEdition}`
      : description;

    if (!type || !finalDescription.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      let fileUrls: string[] = [];
      if (files.length > 0 && type !== 'Achat de logiciel professionnel') {
        const token = localStorage.getItem('macies_token') || '';
        const apiUrl = import.meta.env.VITE_API_URL || 'https://macies-backend.vercel.app/api';
        
        for (const file of files) {
          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: `${apiUrl}/requests/upload-token`,
            clientPayload: token
          });
          fileUrls.push(newBlob.url);
        }
      }

      const fileUrl = fileUrls.length > 0 ? fileUrls.join(',') : null;

      await fetchApi('/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          description: finalDescription,
          fileUrl
        }),
      });
      setSuccess(true);
      setTimeout(() => navigate('/requests'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center p-12 bg-[#111111] border border-[#333333] rounded-xl text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Demande envoyée avec succès !</h2>
        <p className="text-gray-400">Vous allez être redirigé vers le suivi de vos demandes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nouvelle Demande</h1>
        <p className="text-gray-400">Remplissez ce formulaire pour nous soumettre une nouvelle demande de service.</p>
      </div>

      <form className="bg-[#111111] border border-[#333333] rounded-xl p-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type de service *</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)} 
              className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
            >
              <option value="">Sélectionnez un service...</option>
              <option value="Achat de logiciel professionnel">Achat de logiciel professionnel</option>
              <option value="CV professionnel">Aide à la rédaction - CV Professionnel</option>
              <option value="Aide à la rédaction">Aide à la rédaction (Autre document)</option>
              <option value="Édition et mise en page">Édition et mise en page</option>
            </select>
          </div>

          {type === 'Achat de logiciel professionnel' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quel logiciel souhaitez-vous ? *</label>
                <select 
                  value={softwareName} 
                  onChange={(e) => setSoftwareName(e.target.value)} 
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                >
                  <option value="Logiciel de Gestion">Logiciel de Gestion</option>
                  <option value="Suite Microsoft (Office 365, Windows...)">Suite Microsoft (Office 365, Windows...)</option>
                  <option value="Antivirus">Antivirus</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Édition souhaitée *</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Standard', 'Pro', 'Premium'].map(edition => (
                    <button
                      key={edition}
                      type="button"
                      onClick={() => setSoftwareEdition(edition)}
                      className={`py-3 px-4 rounded-lg border text-center transition-colors ${softwareEdition === edition ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-[#1A1A1A] border-[#333333] text-gray-400 hover:border-[#D4AF37]/50'}`}
                    >
                      {edition}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : type === 'CV professionnel' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
                <p className="text-sm text-[#D4AF37]">
                  Pour un CV percutant, merci de détailler au maximum vos informations.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Coordonnées (Nom, Email, Téléphone, Adresse) *</label>
                <textarea 
                  rows={2}
                  value={cvCoordonnees}
                  onChange={(e) => setCvCoordonnees(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                  placeholder="Jean Dupont, jean.dupont@email.com, +223..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expériences professionnelles *</label>
                <textarea 
                  rows={4}
                  value={cvExperiences}
                  onChange={(e) => setCvExperiences(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                  placeholder="- 2020-2023 : Développeur chez XYZ (Missions réalisées...)"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Compétences et Formations *</label>
                <textarea 
                  rows={3}
                  value={cvCompetences}
                  onChange={(e) => setCvCompetences(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                  placeholder="- Licence en Informatique (2019)&#10;- Maîtrise de Word, Excel..."
                ></textarea>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description détaillée *</label>
              <textarea 
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                placeholder="Décrivez précisément votre besoin..."
              ></textarea>
            </div>
          )}

          {type !== 'Achat de logiciel professionnel' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fichiers joints (Optionnel)
                {type === 'CV professionnel' && <span className="text-gray-500 font-normal ml-2">- Vous pouvez joindre votre ancien CV et une photo</span>}
              </label>
              <div className="relative border-2 border-dashed border-[#333333] rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-[#1A1A1A]/50 hover:border-[#D4AF37]/50 transition-colors group">
                <input 
                  type="file" 
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
                <div className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors">
                  <Upload className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" size={24} />
                </div>
                <p className="font-medium text-gray-300 mb-1">
                  {files.length > 0 ? `${files.length} fichier(s) sélectionné(s)` : "Cliquez pour ajouter des fichiers"}
                </p>
                <p className="text-sm text-gray-500">
                  {files.length > 0 
                    ? files.map(f => f.name).join(', ')
                    : "PDF, Word, Images jusqu'à 50 Mo"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-[#333333] flex justify-end">
          <button type="submit" disabled={loading} className="bg-[#D4AF37] hover:bg-[#c29e2f] text-black font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50">
            {loading ? 'Envoi...' : 'Valider la demande'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
}
