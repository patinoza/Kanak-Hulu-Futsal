import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Team, Match, Gallery, Player, OperationType, Group } from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, Users, Calendar, Camera, User as UserIcon, Trophy } from 'lucide-react';

export default function AdminDashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<'teams' | 'matches' | 'gallery' | 'players' | 'groups'>('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showConfirm, setShowConfirm] = useState<{ type: string, id: string } | null>(null);

  // Helper to convert file to base64 (since we are using Firestore to store the data)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB Limit for Firestore performance
        alert('Ukuran file terlalu besar (Maks 1MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTeam, setNewTeam] = useState({ name: '', logoUrl: '', description: '', groupId: '' });
  const [newGroup, setNewGroup] = useState({ name: '' });
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    teamAId: '', teamBId: '', scoreA: 0, scoreB: 0, date: '', time: '', status: 'scheduled', stage: ''
  });
  const [newGallery, setNewGallery] = useState({ url: '', caption: '', date: '' });
  const [newPlayer, setNewPlayer] = useState({ name: '', teamId: '', number: '', position: '' });

  useEffect(() => {
    // Reset form when tab changes
    setEditingId(null);
    setNewTeam({ name: '', logoUrl: '', description: '', groupId: '' });
    setNewGroup({ name: '' });
    setNewMatch({ teamAId: '', teamBId: '', scoreA: 0, scoreB: 0, date: '', time: '', status: 'scheduled', stage: '' });
    setNewGallery({ url: '', caption: '', date: '' });
    setNewPlayer({ name: '', teamId: '', number: '', position: '' });
  }, [activeTab]);

  useEffect(() => {
    const unsubTeams = onSnapshot(collection(db, 'teams'), (snapshot) => {
      setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'teams'));

    const unsubMatches = onSnapshot(collection(db, 'matches'), (snapshot) => {
      setMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'matches'));

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gallery)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'gallery'));

    const unsubPlayers = onSnapshot(collection(db, 'players'), (snapshot) => {
      setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'players'));

    const unsubGroups = onSnapshot(collection(db, 'groups'), (snapshot) => {
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'groups'));

    return () => {
      unsubTeams();
      unsubMatches();
      unsubGallery();
      unsubPlayers();
      unsubGroups();
    };
  }, []);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'teams', editingId), newTeam);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'teams'), newTeam);
      }
      setNewTeam({ name: '', logoUrl: '', description: '', groupId: '' });
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'teams');
    }
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'groups', editingId), newGroup);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'groups'), newGroup);
      }
      setNewGroup({ name: '' });
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'groups');
    }
  };

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'matches', editingId), newMatch);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'matches'), newMatch);
      }
      setNewMatch({ teamAId: '', teamBId: '', scoreA: 0, scoreB: 0, date: '', time: '', status: 'scheduled', stage: '' });
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'matches');
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'gallery', editingId), newGallery);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'gallery'), newGallery);
      }
      setNewGallery({ url: '', caption: '', date: '' });
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'gallery');
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'players', editingId), newPlayer);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'players'), newPlayer);
      }
      setNewPlayer({ name: '', teamId: '', number: '', position: '' });
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'players');
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setShowConfirm(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, collectionName);
    }
  };

  const handleUpdateMatchScore = async (id: string, scoreA: number, scoreB: number, status: 'scheduled' | 'live' | 'finished') => {
    try {
      await updateDoc(doc(db, 'matches', id), { scoreA, scoreB, status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'matches');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-gray-900">Admin Panel</h1>
           <p className="text-gray-500 mt-2 font-medium">Selamat datang, <span className="text-orange-500">{user.displayName || user.email}</span></p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1 overflow-x-auto max-w-full">
          {[
            { id: 'teams', icon: Users, label: 'Tim' },
            { id: 'groups', icon: Trophy, label: 'Grup' },
            { id: 'players', icon: UserIcon, label: 'Pemain' },
            { id: 'matches', icon: Calendar, label: 'Jadwal' },
            { id: 'gallery', icon: Camera, label: 'Galeri' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-gray-900 shadow-lg shadow-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Input Forms */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-28">
            <h2 className="text-xl font-black mb-6 uppercase tracking-tight flex items-center gap-2">
              {editingId ? <Edit2 className="text-orange-500" /> : <Plus className="text-orange-500" />} 
              {editingId ? 'Edit' : 'Tambah'} {activeTab === 'teams' ? 'Tim' : activeTab === 'players' ? 'Pemain' : activeTab === 'matches' ? 'Jadwal' : activeTab === 'groups' ? 'Grup' : 'Foto'}
            </h2>
            
            {activeTab === 'teams' && (
              <form onSubmit={handleAddTeam} className="flex flex-col gap-4">
                <input required placeholder="Nama Tim" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium" />
                <select value={newTeam.groupId} onChange={e => setNewTeam({...newTeam, groupId: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium">
                  <option value="">Pilih Grup (Opsional)</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Logo Tim (File)</label>
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, (base64) => setNewTeam({...newTeam, logoUrl: base64}))} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-medium" />
                  {newTeam.logoUrl && (
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <img src={newTeam.logoUrl} alt="Preview" className="w-10 h-10 rounded-md object-cover" />
                      <span className="text-[10px] text-orange-600 font-bold">Logo Terpilih</span>
                    </div>
                  )}
                </div>
                <textarea placeholder="Deskripsi Singkat" value={newTeam.description} onChange={e => setNewTeam({...newTeam, description: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium min-h-[100px]" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                    {editingId ? 'Update Tim' : 'Simpan Tim'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => {setEditingId(null); setNewTeam({name:'', logoUrl:'', description:'', groupId:''})}} className="p-4 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            )}

            {activeTab === 'groups' && (
              <form onSubmit={handleAddGroup} className="flex flex-col gap-4">
                <input required placeholder="Nama Grup (misal: Grup A)" value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                    {editingId ? 'Update Grup' : 'Simpan Grup'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => {setEditingId(null); setNewGroup({name:''})}} className="p-4 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            )}

            {activeTab === 'players' && (
              <form onSubmit={handleAddPlayer} className="flex flex-col gap-4">
                <input required placeholder="Nama Pemain" value={newPlayer.name} onChange={e => setNewPlayer({...newPlayer, name: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium" />
                <select required value={newPlayer.teamId} onChange={e => setNewPlayer({...newPlayer, teamId: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium">
                  <option value="">Pilih Tim</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="No. Punggung" value={newPlayer.number} onChange={e => setNewPlayer({...newPlayer, number: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium" />
                  <input placeholder="Posisi" value={newPlayer.position} onChange={e => setNewPlayer({...newPlayer, position: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm font-medium" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors">
                    {editingId ? 'Update Pemain' : 'Simpan Pemain'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => {setEditingId(null); setNewPlayer({name:'', teamId:'', number:'', position:''})}} className="p-4 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            )}

            {activeTab === 'matches' && (
              <form onSubmit={handleAddMatch} className="flex flex-col gap-4">
                <select required value={newMatch.teamAId} onChange={e => setNewMatch({...newMatch, teamAId: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium">
                  <option value="">Pilih Tim A</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select required value={newMatch.teamBId} onChange={e => setNewMatch({...newMatch, teamBId: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium">
                  <option value="">Pilih Tim B</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" required value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium" />
                  <input type="time" required value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium" />
                </div>
                <input placeholder="Babak (misal: Semi Final)" value={newMatch.stage} onChange={e => setNewMatch({...newMatch, stage: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors">
                    {editingId ? 'Update Jadwal' : 'Tambah Jadwal'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => {setEditingId(null); setNewMatch({teamAId:'', teamBId:'', scoreA:0, scoreB:0, date:'', time:'', status:'scheduled', stage:''})}} className="p-4 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            )}

            {activeTab === 'gallery' && (
              <form onSubmit={handleAddGallery} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Gambar Galeri (File)</label>
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, (base64) => setNewGallery({...newGallery, url: base64}))} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-medium" />
                  {newGallery.url && (
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <img src={newGallery.url} alt="Preview" className="w-16 h-10 rounded-md object-cover shadow-sm" />
                    </div>
                  )}
                </div>
                <input placeholder="Keterangan Foto" value={newGallery.caption} onChange={e => setNewGallery({...newGallery, caption: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium" />
                <input type="date" value={newGallery.date} onChange={e => setNewGallery({...newGallery, date: e.target.value})} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors">
                    {editingId ? 'Update Galeri' : 'Simpan ke Galeri'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => {setEditingId(null); setNewGallery({url:'', caption:'', date:''})}} className="p-4 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors">
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* List Views */}
        <div className="lg:col-span-2">
           <div className="space-y-4">
             {activeTab === 'teams' && teams.map(team => (
               <div key={team.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                     {team.logoUrl ? <img src={team.logoUrl} alt="" className="w-full h-full object-cover" /> : <Users className="text-gray-300" />}
                   </div>
                   <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{team.name}</span>
                    <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">
                      {groups.find(g => g.id === team.groupId)?.name || 'Tanpa Grup'}
                    </span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => {setEditingId(team.id); setNewTeam({name: team.name, logoUrl: team.logoUrl||'', description: team.description||'', groupId: team.groupId||''})}} className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-xl"><Edit2 size={18} /></button>
                   <button onClick={() => setShowConfirm({ type: 'teams', id: team.id })} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl"><Trash2 size={18} /></button>
                 </div>
               </div>
             ))}

             {activeTab === 'groups' && groups.map(group => (
               <div key={group.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                 <div className="flex flex-col">
                   <span className="font-bold text-gray-900">{group.name}</span>
                   <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{teams.filter(t => t.groupId === group.id).length} Tim Terdaftar</span>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => {setEditingId(group.id); setNewGroup({name: group.name})}} className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-xl"><Edit2 size={18} /></button>
                   <button onClick={() => setShowConfirm({ type: 'groups', id: group.id })} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl"><Trash2 size={18} /></button>
                 </div>
               </div>
             ))}

             {activeTab === 'players' && (
               <div className="space-y-8">
                 {teams.map(team => {
                   const teamPlayers = players.filter(p => p.teamId === team.id);
                   if (teamPlayers.length === 0) return null;
                   return (
                     <div key={team.id} className="space-y-4">
                       <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                         <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                           {team.logoUrl ? <img src={team.logoUrl} alt="" className="w-full h-full object-cover" /> : <Users className="text-gray-300 w-4 h-4" />}
                         </div>
                         <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">{team.name}</h3>
                       </div>
                       <div className="grid gap-4">
                         {teamPlayers.map(player => (
                           <div key={player.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                             <div className="flex flex-col">
                               <span className="font-bold text-gray-900">{player.name} <span className="text-orange-500">#{player.number}</span></span>
                               <span className="text-xs text-gray-400 font-bold uppercase">{player.position}</span>
                             </div>
                             <div className="flex gap-2">
                               <button onClick={() => {setEditingId(player.id); setNewPlayer({name: player.name, teamId: player.teamId, number: player.number||'', position: player.position||''})}} className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-xl"><Edit2 size={18} /></button>
                               <button onClick={() => setShowConfirm({ type: 'players', id: player.id })} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl"><Trash2 size={18} /></button>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   );
                 })}
                 {players.filter(p => !teams.find(t => t.id === p.teamId)).length > 0 && (
                   <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-red-400 border-b border-gray-100 pb-2">Tanpa Tim/Tim Dihapus</h3>
                     {players.filter(p => !teams.find(t => t.id === p.teamId)).map(player => (
                        <div key={player.id} className="bg-white p-6 rounded-2xl border border-red-100 flex items-center justify-between shadow-sm">
                          <span className="font-bold text-gray-900">{player.name}</span>
                          <button onClick={() => setShowConfirm({ type: 'players', id: player.id })} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl"><Trash2 size={18} /></button>
                        </div>
                     ))}
                   </div>
                 )}
               </div>
             )}

             {activeTab === 'matches' && matches.map(match => (
               <div key={match.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-6">
                 <div className="flex justify-between items-start">
                   <div className="text-xs font-black text-gray-300 uppercase tracking-widest">{match.date} • {match.time} • {match.stage}</div>
                   <div className="flex items-center gap-2">
                     <button onClick={() => {setEditingId(match.id); setNewMatch(match)}} className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><Edit2 size={16} /></button>
                     <select 
                      value={match.status} 
                      onChange={e => handleUpdateMatchScore(match.id, match.scoreA, match.scoreB, e.target.value as any)}
                      className="text-xs font-bold bg-gray-50 p-2 rounded-lg"
                     >
                       <option value="scheduled">Scheduled</option>
                       <option value="live">Live</option>
                       <option value="finished">Finished</option>
                     </select>
                   </div>
                 </div>
                 <div className="flex items-center justify-around gap-4">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <span className="font-black text-center text-sm uppercase">{teams.find(t => t.id === match.teamAId)?.name}</span>
                      <input type="number" value={match.scoreA} onChange={e => handleUpdateMatchScore(match.id, parseInt(e.target.value), match.scoreB, match.status)} className="w-16 p-3 bg-gray-50 rounded-xl text-center font-black text-2xl border border-gray-100" />
                    </div>
                    <span className="text-gray-200 font-black">VS</span>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <span className="font-black text-center text-sm uppercase">{teams.find(t => t.id === match.teamBId)?.name}</span>
                      <input type="number" value={match.scoreB} onChange={e => handleUpdateMatchScore(match.id, match.scoreA, parseInt(e.target.value), match.status)} className="w-16 p-3 bg-gray-50 rounded-xl text-center font-black text-2xl border border-gray-100" />
                    </div>
                 </div>
                 <button onClick={() => setShowConfirm({ type: 'matches', id: match.id })} className="self-end p-2 text-red-400 hover:text-red-500"><Trash2 size={16} /></button>
               </div>
             ))}

             {activeTab === 'gallery' && (
               <div className="grid grid-cols-2 gap-4">
                 {gallery.map(img => (
                   <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-100">
                     <img src={img.url} alt="" className="w-full h-full object-cover" />
                     <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => {setEditingId(img.id); setNewGallery({url: img.url, caption: img.caption||'', date: img.date||''})}} className="p-2 bg-white text-gray-600 rounded-lg shadow-md hover:text-orange-500"><Edit2 size={14}/></button>
                        <button onClick={() => setShowConfirm({ type: 'gallery', id: img.id })} className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"><Trash2 size={14}/></button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Hapus Data?</h3>
              <p className="text-gray-500 text-sm mb-8">Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus item ini?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 py-3 px-6 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleDelete(showConfirm.type, showConfirm.id)}
                  className="flex-1 py-3 px-6 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
