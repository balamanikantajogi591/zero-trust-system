import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, MoreVertical, Shield, UserCheck, UserX,
  Trash2, ShieldCheck, X, ChevronDown
} from 'lucide-react';
import { userApi } from '../services/api';
import { useToast } from '../components/Toast';

const ROLES = ['ADMIN', 'ANALYST', 'USER', 'VIEWER'];

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-white/5 rounded w-full" />
      </td>
    ))}
  </tr>
);

const AddUserModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '', role: 'USER' });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.createUser(form);
      toast({ type: 'success', title: 'User Created', message: `${form.email} has been added.` });
      onCreated();
      onClose();
    } catch (err) {
      toast({ type: 'error', title: 'Failed', message: 'Could not create user. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative glass-card w-full max-w-md p-8 z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New User
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">First Name</label>
              <input
                type="text" required
                value={form.firstname} onChange={e => setForm({ ...form, firstname: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none transition-all"
                placeholder="John"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Last Name</label>
              <input
                type="text" required
                value={form.lastname} onChange={e => setForm({ ...form, lastname: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none transition-all"
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Email</label>
            <input
              type="email" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none transition-all"
              placeholder="john@company.com"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Password</label>
            <input
              type="password" required minLength={6}
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Role</label>
            <select
              value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-primary/50 outline-none transition-all appearance-none"
            >
              {ROLES.map(r => <option key={r} value={r} className="bg-[#121214]">{r}</option>)}
            </select>
          </div>
          <button
            type="submit" disabled={saving}
            className="w-full mt-2 bg-primary hover:bg-primary/80 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const ActionMenu = ({ user, onRoleChange, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute right-0 top-10 z-40 glass-card w-44 p-2 shadow-2xl"
          >
            <p className="text-[10px] text-gray-600 uppercase tracking-widest px-3 py-1 mb-1">Change Role</p>
            {ROLES.map(role => (
              <button
                key={role}
                onClick={() => { onRoleChange(user.id, role); setOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all flex items-center gap-2 ${user.role === role ? 'text-primary' : 'text-gray-400'}`}
              >
                <ShieldCheck className="w-3 h-3" />
                {role}
              </button>
            ))}
            <hr className="border-white/5 my-2" />
            <button
              onClick={() => { onDelete(user.id, user.email); setOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-accent hover:bg-accent/10 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3" />
              Delete User
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast({ type: 'error', title: 'Load Failed', message: 'Could not load users.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await userApi.updateUserRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      toast({ type: 'success', title: 'Role Updated', message: `Role changed to ${role}.` });
    } catch {
      toast({ type: 'error', message: 'Failed to update role.' });
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Delete ${email}? This cannot be undone.`)) return;
    try {
      await userApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast({ type: 'success', title: 'User Deleted', message: `${email} has been removed.` });
    } catch {
      toast({ type: 'error', message: 'Failed to delete user.' });
    }
  };

  const filtered = users.filter(u =>
    `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <AnimatePresence>
        {showModal && <AddUserModal onClose={() => setShowModal(false)} onCreated={fetchUsers} />}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-1">User Management</h1>
          <p className="text-gray-500 text-sm">{users.length} users · Control access and roles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/80 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="glass-card px-4 py-2.5 flex items-center gap-3">
        <Shield className="w-4 h-4 text-gray-500 shrink-0" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent text-sm outline-none w-full placeholder-gray-600"
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Risk Level</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                  No users found
                </td>
              </tr>
            ) : filtered.map(user => (
              <tr key={user.id} className="hover:bg-white/5 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shrink-0">
                      {user.firstname?.[0]}{user.lastname?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.firstname} {user.lastname}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                    user.role === 'ADMIN' ? 'bg-accent/10 text-accent border-accent/20' :
                    user.role === 'ANALYST' ? 'bg-primary/10 text-primary border-primary/20' :
                    'bg-white/5 text-gray-400 border-white/10'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs ${user.status?.toLowerCase() === 'active' ? 'text-secondary' : 'text-accent'}`}>
                    {user.status?.toLowerCase() === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    {user.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      (user.riskScore || 20) < 30 ? 'bg-secondary' :
                      (user.riskScore || 20) < 70 ? 'bg-yellow-500' : 'bg-accent'
                    }`} style={{ width: `${user.riskScore || 20}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 block">{user.riskScore || 20}% Risk</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionMenu user={user} onRoleChange={handleRoleChange} onDelete={handleDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
