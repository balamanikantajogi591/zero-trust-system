import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users as UsersIcon, Shield, UserX, UserCheck, Edit, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <UsersIcon className="w-8 h-8 mr-3 text-primary" />
            User Management
          </h1>
          <p className="text-gray-400">Control access, assign roles, and monitor status.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-black font-semibold rounded hover:bg-primary/90 transition-colors">
          + Add User
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center flex-1 max-w-md bg-black/40 border border-white/10 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="bg-transparent border-none focus:outline-none w-full text-sm text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">MFA</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="show">
              {users.map((user) => (
                <motion.tr variants={itemVariants} key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 mr-3">
                        <span className="text-primary font-bold text-xs">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 border rounded text-xs font-medium ${
                      user.role === 'ROLE_ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      user.role === 'ROLE_ANALYST' ? 'bg-accent/10 text-accent border-accent/20' : 
                      'bg-white/5 text-gray-300 border-white/10'
                    }`}>
                      {user.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      <span className="text-sm text-gray-300">{user.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {user.mfaEnabled ? (
                      <Shield className="w-4 h-4 text-green-500" title="MFA Enabled" />
                    ) : (
                      <Shield className="w-4 h-4 text-gray-600" title="MFA Disabled" />
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'Active' ? (
                        <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-yellow-400 transition-colors" title="Suspend">
                          <UserX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-green-400 transition-colors" title="Activate">
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 bg-white/5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Loading users...</td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
