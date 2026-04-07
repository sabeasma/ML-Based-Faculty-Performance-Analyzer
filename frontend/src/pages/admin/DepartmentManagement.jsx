import { useEffect, useMemo, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from '../../services/api';

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', hod: '' });

  const recordsPerPage = 10;

  async function loadDepartments() {
    try {
      setLoading(true);
      setError('');
      const rows = await getDepartments();
      setDepartments(Array.isArray(rows) ? rows : []);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredRows = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return departments;
    return departments.filter((item) => String(item.name || '').toLowerCase().includes(key));
  }, [departments, search]);

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
    setForm({ name: '', hod: '' });
    setIsModalOpen(true);
  }

  function openEditModal(row) {
    setEditingId(row.id);
    setForm({ name: row.name || '', hod: row.hod || '' });
    setIsModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError('');
      const payload = { name: form.name, hod: form.hod ? Number(form.hod) : null };
      if (editingId) {
        await updateDepartment(editingId, payload);
      } else {
        await createDepartment(payload);
      }
      setIsModalOpen(false);
      await loadDepartments();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to save department');
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this department?');
    if (!confirmed) return;

    try {
      setError('');
      await deleteDepartment(id);
      await loadDepartments();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to delete department');
    }
  }

  return (
    <RolePageTemplate title="Department Management" description="Overview and monitor department-level staffing and analytics coverage.">
      <section className="glass-card rounded-xl p-4 shadow-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search departments"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none sm:w-80"
          />
          <button type="button" onClick={openAddModal} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
            Add Department
          </button>
        </div>

        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

        <div className="scroll-thin max-h-[34rem] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">HOD User ID</th>
                <th className="px-3 py-2">Faculty Count</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center">Loading...</td>
                </tr>
              ) : paginatedRows.length ? (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.hod || '-'}</td>
                    <td className="px-3 py-2">{row.facultyCount}</td>
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
                  <td colSpan={4} className="px-3 py-4 text-center">No records found</td>
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
          <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-lg bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold">{editingId ? 'Edit Department' : 'Add Department'}</h3>
            <div className="grid grid-cols-1 gap-3">
              <input className="rounded border px-3 py-2" placeholder="Department Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
              <input className="rounded border px-3 py-2" placeholder="HOD User ID (optional)" type="number" min="1" value={form.hod} onChange={(event) => setForm((prev) => ({ ...prev, hod: event.target.value }))} />
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
