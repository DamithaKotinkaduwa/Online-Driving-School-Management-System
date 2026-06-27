import React, { useState } from 'react';
import Card from '../../components/Card';
import './AdminUsers.css';

const INITIAL_USERS = [
  { id: 1, name: 'Admin User',      email: 'admin@drive.com',      role: 'Admin',      phone: '+1 555-0100', isActive: true,  joined: 'Jan 10, 2024' },
  { id: 2, name: 'Sarah Johnson',   email: 'sarah@drive.com',      role: 'Instructor', phone: '+1 555-0201', isActive: true,  joined: 'Feb 03, 2024' },
  { id: 3, name: 'Mike Torres',     email: 'mike@drive.com',       role: 'Instructor', phone: '+1 555-0202', isActive: true,  joined: 'Feb 15, 2024' },
  { id: 4, name: 'Linda Park',      email: 'linda@drive.com',      role: 'Instructor', phone: '+1 555-0203', isActive: false, joined: 'Mar 01, 2024' },
  { id: 5, name: 'John Student',    email: 'student@drive.com',    role: 'Student',    phone: '+1 555-0301', isActive: true,  joined: 'Mar 20, 2024' },
  { id: 6, name: 'Alice Kim',       email: 'alice@drive.com',      role: 'Student',    phone: '+1 555-0302', isActive: true,  joined: 'Apr 05, 2024' },
  { id: 7, name: 'Bob Smith',       email: 'bob@drive.com',        role: 'Student',    phone: '+1 555-0303', isActive: true,  joined: 'Apr 12, 2024' },
  { id: 8, name: 'Carol Davis',     email: 'carol@drive.com',      role: 'Student',    phone: '+1 555-0304', isActive: false, joined: 'May 01, 2024' },
  { id: 9, name: 'David Lee',       email: 'david@drive.com',      role: 'Student',    phone: '+1 555-0305', isActive: true,  joined: 'May 18, 2024' },
  { id: 10, name: 'Emma Wilson',    email: 'emma@drive.com',       role: 'Student',    phone: '+1 555-0306', isActive: true,  joined: 'Jun 02, 2024' },
];

const ROLE_COLORS = {
  Admin:      { bg: '#EDE9FE', text: '#4C1D95' },
  Instructor: { bg: '#D1FAE5', text: '#065F46' },
  Student:    { bg: '#EEF2FF', text: '#3730A3' },
};

export default function AdminUsers() {
  const [users, setUsers]     = useState(INITIAL_USERS);
  const [search, setSearch]   = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [editUser, setEditUser]     = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [newUser, setNewUser]       = useState({ name:'', email:'', role:'Student', phone:'' });
  const [toast, setToast]           = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    showToast('User status updated.');
  };
  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('User deleted.');
  };
  const saveEdit = () => {
    setUsers(prev => prev.map(u => u.id === editUser.id ? editUser : u));
    setEditUser(null);
    showToast('User updated.');
  };
  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    const u = { ...newUser, id: Date.now(), isActive: true, joined: new Date().toLocaleDateString('en-US', { month:'short', day:'2-digit', year:'numeric'}) };
    setUsers(prev => [...prev, u]);
    setNewUser({ name:'', email:'', role:'Student', phone:'' });
    setShowAdd(false);
    showToast(`${u.name} added successfully.`);
  };

  const counts = { Admin: users.filter(u=>u.role==='Admin').length, Instructor: users.filter(u=>u.role==='Instructor').length, Student: users.filter(u=>u.role==='Student').length };

  return (
    <div className="admin-users-page">
      {/* Summary */}
      <div className="user-summary">
        {['Admin','Instructor','Student'].map(r => {
          const c = ROLE_COLORS[r];
          return (
            <div className="user-sum-card" key={r}>
              <div className="user-sum-num" style={{ color: c.text }}>{counts[r]}</div>
              <div className="user-sum-role">{r}s</div>
            </div>
          );
        })}
        <div className="user-sum-card">
          <div className="user-sum-num" style={{ color:'#10B981' }}>{users.filter(u=>u.isActive).length}</div>
          <div className="user-sum-role">Active</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <input
          className="search-input"
          placeholder="🔍  Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display:'flex', gap:8 }}>
          {['All','Admin','Instructor','Student'].map(r => (
            <button key={r} className={`filter-tab ${roleFilter===r?'active':''}`} onClick={() => setRoleFilter(r)}>{r}</button>
          ))}
        </div>
        <button className="add-btn" onClick={() => setShowAdd(true)}>+ Add User</button>
      </div>

      {/* Table */}
      <Card className="users-table-card">
        <table className="users-table">
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const rc = ROLE_COLORS[u.role];
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className="u-avatar" style={{ background: rc.bg, color: rc.text }}>{u.name[0]}</div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><span className="role-badge" style={{ background: rc.bg, color: rc.text }}>{u.role}</span></td>
                  <td>{u.phone || '–'}</td>
                  <td>{u.joined}</td>
                  <td>
                    <span className={`status-dot ${u.isActive ? 'active' : 'inactive'}`}>
                      {u.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="action-btn edit" onClick={() => setEditUser({...u})}>Edit</button>
                      <button className="action-btn toggle" onClick={() => toggleActive(u.id)}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="action-btn del" onClick={() => deleteUser(u.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign:'center', color:'#94A3B8', padding:'30px' }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Edit Modal */}
      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Edit User</h3>
            <div className="modal-fields">
              {['name','email','phone'].map(f => (
                <div className="mf" key={f}>
                  <label>{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                  <input value={editUser[f]||''} onChange={e => setEditUser({...editUser,[f]:e.target.value})} />
                </div>
              ))}
              <div className="mf">
                <label>Role</label>
                <select value={editUser.role} onChange={e => setEditUser({...editUser,role:e.target.value})}>
                  <option>Admin</option><option>Instructor</option><option>Student</option>
                </select>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button className="nav-btn sec" onClick={() => setEditUser(null)}>Cancel</button>
              <button className="nav-btn prim" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add New User</h3>
            <div className="modal-fields">
              {['name','email','phone'].map(f => (
                <div className="mf" key={f}>
                  <label>{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                  <input value={newUser[f]||''} onChange={e => setNewUser({...newUser,[f]:e.target.value})} placeholder={f==='email'?'user@drive.com':''} />
                </div>
              ))}
              <div className="mf">
                <label>Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser,role:e.target.value})}>
                  <option>Admin</option><option>Instructor</option><option>Student</option>
                </select>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button className="nav-btn sec" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="nav-btn prim" onClick={addUser}>Add User</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
