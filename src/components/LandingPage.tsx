import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Team, Match, Gallery, Player, OperationType, Group } from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Calendar, Users, Camera, MapPin, ChevronRight, Activity, X } from 'lucide-react';

export default function LandingPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    const unsubTeams = onSnapshot(collection(db, 'teams'), (snapshot) => {
      setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'teams'));

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snapshot) => {
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'groups'));

    const unsubMatches = onSnapshot(collection(db, 'matches'), (snapshot) => {
      setMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'matches'));

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gallery)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'gallery'));

    const unsubPlayers = onSnapshot(collection(db, 'players'), (snapshot) => {
      setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'players'));

    return () => {
      unsubTeams();
      unsubGroups();
      unsubMatches();
      unsubGallery();
      unsubPlayers();
    };
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop" 
            alt="Futsal Court" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/60 to-gray-900" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-widest mb-6 border border-orange-400 shadow-lg shadow-orange-500/20">
              Turnamen Nasional 2026
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8 tracking-tighter uppercase italic">
              Kanak Hulu <br/><span className="text-transparent border-t-2 border-b-2 border-white px-2">Futsal</span> Cup
            </h1>
            <p className="text-xl text-gray-300 font-medium mb-10 max-w-2xl mx-auto">
              Ajang bergengsi pencarian bakat futsal terbaik se-Kanak Hulu. Persiapan, Dedikasi, dan Kejayaan menanti Anda.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#jadwal" className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                Lihat Jadwal <ChevronRight size={20} />
              </a>
              <a href="#tim" className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-colors">
                Daftar Tim
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Overview */}
      <section className="max-w-7xl mx-auto w-full px-4 -mt-32 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Peserta Tim', value: teams.length, icon: Users },
            { label: 'Jadwal Pertandingan', value: matches.length, icon: Calendar },
            { label: 'Total Pemain', value: players.length + '+', icon: Trophy },
            { label: 'Lokasi Strategis', value: '4', icon: MapPin },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center gap-2"
            >
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl mb-2">
                <stat.icon size={24} />
              </div>
              <span className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</span>
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Group Tables Section */}
      <section id="grup" className="max-w-7xl mx-auto w-full px-4 scroll-mt-20">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Fase Grup</span>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mt-2 flex items-center justify-center gap-4">
            Klasemen & Pembagian Grup <Trophy className="text-gray-300" />
          </h2>
          <p className="text-gray-500 mt-4 font-medium italic">Juara Grup A & Juara Grup B otomatis melaju ke Babak Final.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {groups.map((group) => {
            const groupTeams = teams.filter(t => t.groupId === group.id);
            return (
              <motion.div 
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30 overflow-hidden"
              >
                <div className="bg-gray-900 p-4 text-center">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm">{group.name}</h3>
                </div>
                <div className="p-2">
                  <table className="w-full">
                    <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Tim</th>
                        <th className="py-3 px-4 text-right">P</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {groupTeams.map((team, idx) => (
                        <tr key={team.id} className="group hover:bg-orange-50 transition-colors cursor-pointer" onClick={() => setSelectedTeam(team)}>
                          <td className="py-3 px-4 flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-300">{idx + 1}</span>
                            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                              {team.logoUrl ? <img src={team.logoUrl} alt="" className="w-full h-full object-cover" /> : <Users size={12} className="text-gray-300" />}
                            </div>
                            <span className="text-xs font-bold text-gray-700 uppercase group-hover:text-orange-600 transition-colors">{team.name}</span>
                          </td>
                          <td className="py-3 px-4 text-right text-xs font-black text-gray-400">0</td>
                        </tr>
                      ))}
                      {groupTeams.length === 0 && (
                        <tr>
                          <td colSpan={2} className="py-10 text-center text-[10px] text-gray-400 font-medium italic">Belum ada tim</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tournament Flow / Bracket */}
      <section className="max-w-5xl mx-auto w-full px-4 text-center">
        <div className="bg-orange-500 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-orange-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
             <Trophy size={120} className="text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <span className="text-2xl font-black text-white italic">A</span>
              </div>
              <span className="text-white font-black uppercase tracking-widest text-sm">Juara Grup A</span>
            </div>

            <div className="flex flex-col items-center">
               <div className="h-0.5 w-12 bg-white/30 hidden md:block mb-4" />
               <div className="bg-white text-orange-600 px-6 py-2 rounded-full font-black text-sm uppercase tracking-tighter shadow-lg">
                 VS
               </div>
               <div className="h-0.5 w-12 bg-white/30 hidden md:block mt-4" />
               <span className="text-white/60 font-black text-3xl mt-4 hidden md:block">FINAL</span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <span className="text-2xl font-black text-white italic">B</span>
              </div>
              <span className="text-white font-black uppercase tracking-widest text-sm">Juara Grup B</span>
            </div>
          </div>
          <p className="text-white/80 font-medium mt-12 text-lg italic">
            "Satu tujuan, satu kejayaan. Siapakah yang akan mengangkat trofi?"
          </p>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="jadwal" className="max-w-7xl mx-auto w-full px-4 scroll-mt-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Informasi Terkini</span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
              Jadwal & Hasil <Calendar className="text-gray-300" />
            </h2>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE SEKARANG
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.length === 0 ? (
            <div className="col-span-2 p-20 bg-gray-50 rounded-3xl text-center text-gray-500 font-medium">
              Belum ada jadwal pertandingan yang diinput.
            </div>
          ) : (
            matches.map((match, i) => {
              const teamA = teams.find(t => t.id === match.teamAId);
              const teamB = teams.find(t => t.id === match.teamBId);
              return (
                <motion.div 
                  key={match.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-100 hover:border-orange-200 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      match.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 
                      match.status === 'finished' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {match.status}
                    </span>
                  </div>
                  
                  <div className="text-xs font-bold text-gray-400 mb-6 flex items-center gap-2">
                    {match.date} • {match.time} • {match.stage}
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-center gap-4 flex-1 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden border border-gray-100">
                        {teamA?.logoUrl ? <img src={teamA.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Trophy size={32} className="text-gray-200" />}
                      </div>
                      <span className="font-black text-lg tracking-tight uppercase">{teamA?.name || 'TIM A'}</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-black flex items-center gap-3">
                        <span className={match.status === 'scheduled' ? 'text-gray-200' : 'text-gray-900'}>{match.scoreA}</span>
                        <span className="text-gray-300">-</span>
                        <span className={match.status === 'scheduled' ? 'text-gray-200' : 'text-gray-900'}>{match.scoreB}</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 mt-2 tracking-widest uppercase">Skor Akhir</span>
                    </div>

                    <div className="flex flex-col items-center gap-4 flex-1 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden border border-gray-100">
                        {teamB?.logoUrl ? <img src={teamB.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <Trophy size={32} className="text-gray-200" />}
                      </div>
                      <span className="font-black text-lg tracking-tight uppercase">{teamB?.name || 'TIM B'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium italic">
                    {match.stage}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* Teams Grid */}
      <section id="tim" className="bg-gray-50 py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Peserta Turnamen</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mt-4">
              Tim Yang Bertanding
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {teams.length === 0 ? (
               <div className="col-span-full text-center py-20 text-gray-500 font-medium">Belum ada tim yang terdaftar.</div>
            ) : (
              teams.map((team, i) => (
                <motion.div 
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-200/50 flex flex-col items-center text-center gap-4 border border-white hover:border-orange-200 transition-all cursor-pointer"
                  onClick={() => setSelectedTeam(team)}
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden mb-2">
                    {team.logoUrl ? <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" /> : <Users size={40} className="text-gray-200" />}
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-tight line-clamp-1">{team.name}</h3>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="galeri" className="max-w-7xl mx-auto w-full px-4 scroll-mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
             <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Momen Terbaik</span>
             <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
               Galeri Foto <Camera className="text-gray-300" />
             </h2>
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {gallery.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500 font-medium">Belum ada foto di galeri.</div>
          ) : (
            gallery.map((img, i) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative group rounded-3xl overflow-hidden shadow-xl"
              >
                <img src={img.url} alt={img.caption} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>



      {/* Team Details Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeam(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-6 right-6">
                <button onClick={() => setSelectedTeam(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                  <div className="w-32 h-32 bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden border border-gray-100">
                    {selectedTeam.logoUrl ? <img src={selectedTeam.logoUrl} alt="" className="w-full h-full object-cover" /> : <Users size={48} className="text-gray-200" />}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">{selectedTeam.name}</h2>
                    <p className="text-gray-500 mt-2 font-medium">{selectedTeam.description || 'Tim resmi peserta turnamen Kanak Hulu 2026.'}</p>
                  </div>
                </div>

                <div>
                   <h3 className="text-xs font-black uppercase tracking-widest text-orange-500 mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
                     Anggota Tim <Activity size={14} />
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                     {players.filter(p => p.teamId === selectedTeam.id).length === 0 ? (
                       <p className="text-sm text-gray-400 font-medium italic">Belum ada pemain yang terdaftar untuk tim ini.</p>
                     ) : (
                       players.filter(p => p.teamId === selectedTeam.id).map(player => (
                         <div key={player.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-xs text-orange-500 shadow-sm">
                               {player.number}
                             </div>
                             <span className="font-bold text-gray-900">{player.name}</span>
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">{player.position}</span>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
