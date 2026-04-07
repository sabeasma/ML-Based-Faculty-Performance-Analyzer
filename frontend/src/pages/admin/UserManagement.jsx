import { useEffect, useMemo, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { createUser, deleteUser, getDepartments, getUsers, updateUser } from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'FACULTY',
    departmentId: '',
    isActive: 1,
  });

  const recordsPerPage = 10;

  async function loadUsers() {
    try {
      setLoading(true);
      setError('');
      const [userRows, departmentRows] = await Promise.all([getUsers(), getDepartments()]);
      setUsers(Array.isArray(userRows) ? userRows : []);
      setDepartments(Array.isArray(departmentRows) ? departmentRows : []);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredRows = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return users;

    return users.filter((item) => {
      return (
        String(item.name || '').toLowerCase().includes(key) ||
        String(item.email || '').toLowerCase().includes(key) ||
        String(item.role || '').toLowerCase().includes(key)
      );
    });
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / recordsPerPage));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredRows.slice(start, start + recordsPerPage);
  }, [filteredRows, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function openAddModal() {
    setEditingId(null);
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'FACULTY',
      departmentId: '',
      isActive: 1,
    });
    setIsModalOpen(true);
  }

  function openEditModal(row) {
    setEditingId(row.id);
    setForm({
      name: row.name || '',
      email: row.email || '',
      password: '',
      role: row.role || 'FACULTY',
      departmentId: row.department_id || '',
      isActive: Number(row.isActive || 0),
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError('');
      const payload = {
        ...form,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        isActive: Number(form.isActive),
      };

      if (!payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await updateUser(editingId, payload);
      } else {
        await createUser(payload);
      }

      setIsModalOpen(false);
      await loadUsers();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to save user');
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      setError('');
      await deleteUser(id);
      await loadUsers();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to delete user');
    }
  }

  return (
    <RolePageTemplate title="User Management" description="Manage user profiles, roles and active status across the platform.">
      <section className="glass-card rounded-xl p-4 shadow-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none sm:w-80"
          />
          <button type="button" onClick={openAddModal} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
            Add User
          </button>
        </div>

        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

        <div className="scroll-thin max-h-[34rem] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center">Loading...</td>
                </tr>
              ) : paginatedRows.length ? (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.email}</td>
                    <td className="px-3 py-2">{row.role}</td>
                    <td className="px-3 py-2">{row.department || '-'}</td>
                    <td className="px-3 py-2">{Number(row.isActive) === 1 ? 'Active' : 'Inactive'}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEditModal(row)} className="rounded border px-2 py-1 text-xs">Edit</button>
                        <button type="button" onClick={() => handleDelete(row.id)} className="rounded border border-red-300 px-2 py-1 text-xs text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
          <p>
            Showing {filteredRows.length === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1}-
            {Math.min(currentPage * recordsPerPage, filteredRows.length)} of {filteredRows.length}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded border border-slate-300 px-2 py-1 disabled:opacity-50">
              ◀ Previous
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded border border-slate-300 px-2 py-1 disabled:opacity-50">
              Next ▶
            </button>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-lg bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold">{editingId ? 'Edit User' : 'Add User'}</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input className="rounded border px-3 py-2" placeholder="Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
              <input className="rounded border px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
              <input className="rounded border px-3 py-2" placeholder={editingId ? 'Password (optional)' : 'Password'} type="password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} required={!editingId} />
              <select className="rounded border px-3 py-2" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}>
                <option value="ADMIN">ADMIN</option>
                <option value="HOD">HOD</option>
                <option value="FACULTY">FACULTY</option>
                <option value="STUDENT">STUDENT</option>
              </select>
              <select className="rounded border px-3 py-2" value={form.departmentId} onChange={(event) => setForm((prev) => ({ ...prev, departmentId: event.target.value }))}>
                <option value="">No Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
              <select className="rounded border px-3 py-2" value={form.isActive} onChange={(event) => setForm((prev) => ({ ...prev, isActive: Number(event.target.value) }))}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded border px-3 py-2">Cancel</button>
              <button type="submit" className="rounded bg-blue-600 px-3 py-2 font-semibold text-white">Save</button>
            </div>
          </form>
        </div>
      ) : null}
    </RolePageTemplate>
  );
}
