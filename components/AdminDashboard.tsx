import React, { useEffect, useState } from 'react';
import { Users, LogOut, Search, Download, Trash2, Check, Clock } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  joinedAt: string;
  status?: 'active' | 'pending';
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('realview_users') || '[]');
    // Sort by date desc (Newest first)
    setUsers(storedUsers.reverse());
  }, []);

  const handleDelete = (emailToDelete: string) => {
    if (window.confirm(`Are you sure you want to remove ${emailToDelete}?`)) {
      const newUsers = users.filter(u => u.email !== emailToDelete);
      setUsers(newUsers);
      // Reverse back to chronological order for storage
      localStorage.setItem('realview_users', JSON.stringify([...newUsers].reverse())); 
    }
  };

  const handleApprove = (emailToApprove: string) => {
    const newUsers = users.map(u => 
      u.email === emailToApprove ? { ...u, status: 'active' as const } : u
    );
    setUsers(newUsers);
    // Reverse back to chronological order for storage
    localStorage.setItem('realview_users', JSON.stringify([...newUsers].reverse()));
  };

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status !== 'pending').filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-slate-900 p-1.5 rounded-lg text-white">
               <Users size={20} />
             </div>
             <h1 className="font-black text-lg tracking-tight">Realview Admin</h1>
             <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Dashboard</span>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Pending Approvals Section */}
        {pendingUsers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="text-orange-500" size={24} />
              Pending Approvals 
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">{pendingUsers.length}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingUsers.map((user) => (
                <div key={user.email} className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{user.name}</h3>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">PENDING</span>
                  </div>
                  <div className="text-xs text-slate-400 mb-4">
                    Requested: {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => handleApprove(user.email)}
                    className="w-full py-2 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={14} />
                    Approve Access
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Registered Users</h2>
            <p className="text-slate-500 text-sm">Manage active user accounts.</p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-64 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-all">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Customer Name</th>
                  <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Email Address</th>
                  <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeUsers.length > 0 ? (
                  activeUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-600 font-bold text-xs border border-brand-200">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-sm text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-slate-600">{user.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md uppercase tracking-wide">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleDelete(user.email)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center opacity-50">
                        <Users size={48} className="mb-4 text-slate-300" />
                        <p className="text-slate-900 font-bold">No active users found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};