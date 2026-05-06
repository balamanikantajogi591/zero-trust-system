import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, MoreVertical, Shield, UserCheck, UserX, Loader2 } from 'lucide-react';
import { userApi } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p>Loading secure user directory...</p>
      </div>
    );
  }
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold neon-text mb-2">User Management</h1>
          <p className="text-gray-500">Control system access and role-based permissions</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/80 px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-glow">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

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
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.firstname?.[0]}{user.lastname?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.firstname} {user.lastname}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-primary" />
                    <span className="text-xs font-semibold">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs ${user.status?.toLowerCase() === 'active' ? 'text-secondary' : 'text-accent'}`}>
                    {user.status?.toLowerCase() === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    {user.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        user.riskScore < 30 ? 'bg-secondary w-1/4' : 
                        user.riskScore < 70 ? 'bg-yellow-500 w-2/4' : 'bg-accent w-3/4'
                      }`}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 block">{user.riskScore}% Risk</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
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
