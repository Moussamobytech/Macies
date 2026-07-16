export function AdminLogs() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Logs d'activité</h1>
        <p className="text-gray-400">Traçabilité des actions des administrateurs.</p>
      </div>
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <p className="text-gray-400 text-center">Aucun log enregistré pour le moment.</p>
      </div>
    </div>
  );
}
