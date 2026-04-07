import { useEffect, useMemo, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { createFaculty, deleteFaculty, getDepartments, getFacultyList, updateFaculty } from '../../services/api';

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    departmentId: '',
    qualification: '',
    experience: 0,
    subjectsHandled: 0,
    attendancePercentage: 0,
    researchPublications: 0,
    researchImpactScore: 0,
    studentFeedbackScore: 0,
    mlScore: 0,
  });

  const recordsPerPage = 10;

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [facultyRows, departmentRows] = await Promise.all([getFacultyList(), getDepartments()]);
      setFaculty(Array.isArray(facultyRows) ? facultyRows : []);
      setDepartments(Array.isArray(departmentRows) ? departmentRows : []);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to load faculty data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return faculty;

    return faculty.filter((item) => {
      return (
        String(item.name || '').toLowerCase().includes(key) ||
        String(item.email || '').toLowerCase().includes(key) ||
        String(item.department || '').toLowerCase().includes(key)
      );
    });
  }, [faculty, search]);

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
      departmentId: departments[0]?.id || '',
      qualification: '',
      experience: 0,
      subjectsHandled: 0,
      attendancePercentage: 0,
      researchPublications: 0,
      researchImpactScore: 0,
      studentFeedbackScore: 0,
      mlScore: 0,
    });
    setIsModalOpen(true);
  }

  function openEditModal(row) {
    setEditingId(row.faculty_id);
    setForm({
      name: row.name || '',
      email: row.email || '',
      departmentId: row.department_id || departments[0]?.id || '',
      qualification: row.qualification || '',
      experience: row.experience || 0,
      subjectsHandled: row.subjectsHandled || 0,
      attendancePercentage: row.attendancePercentage || 0,
      researchPublications: row.researchPublications || 0,
      researchImpactScore: row.researchImpactScore || 0,
      studentFeedbackScore: row.studentFeedbackScore || 0,
      mlScore: row.mlScore || 0,
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError('');
      if (editingId) {
        await updateFaculty(editingId, form);
      } else {
        await createFaculty(form);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to save faculty');
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this faculty record?');
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await deleteFaculty(id);
      await loadData();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to delete faculty');
    }
  }

  return (
    <RolePageTemplate title="Faculty Management" description="Manage faculty records and monitor individual ML performance.">
      <section className="glass-card rounded-xl p-4 shadow-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search by name, email or department"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none sm:w-80"
          />
          <button type="button" onClick={openAddModal} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
            Add Faculty
          </button>
        </div>

        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

        <div className="scroll-thin max-h-[34rem] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Qualification</th>
                <th className="px-3 py-2">Experience</th>
                <th className="px-3 py-2">Subjects</th>
                <th className="px-3 py-2">Attendance</th>
                <th className="px-3 py-2">Research Publications</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center">Loading...</td>
                </tr>
              ) : paginatedRows.length ? (
                paginatedRows.map((row) => (
                  <tr key={row.faculty_id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.department}</td>
                    <td className="px-3 py-2">{row.qualification}</td>
                    <td className="px-3 py-2">{row.experience}</td>
                    <td className="px-3 py-2">{row.subjectsHandled}</td>
                    <td className="px-3 py-2">{row.attendancePercentage}%</td>
                    <td className="px-3 py-2">{row.researchPublications}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEditModal(row)} className="rounded border px-2 py-1 text-xs">Edit</button>
                        <button type="button" onClick={() => handleDelete(row.faculty_id)} className="rounded border border-red-300 px-2 py-1 text-xs text-red-600">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center">No records found</td>
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
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded border border-slate-300 px-2 py-1 disabled:opacity-50"
            >
              ◀ Previous
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded border border-slate-300 px-2 py-1 disabled:opacity-50"
            >
              Next ▶
            </button>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-lg bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold">{editingId ? 'Edit Faculty' : 'Add Faculty'}</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input className="rounded border px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
              <input className="rounded border px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
              <select className="rounded border px-3 py-2" value={form.departmentId} onChange={(e) => setForm((prev) => ({ ...prev, departmentId: e.target.value }))} required>
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
              <input className="rounded border px-3 py-2" placeholder="Qualification" value={form.qualification} onChange={(e) => setForm((prev) => ({ ...prev, qualification: e.target.value }))} required />
              <input className="rounded border px-3 py-2" placeholder="Experience" type="number" min="0" value={form.experience} onChange={(e) => setForm((prev) => ({ ...prev, experience: Number(e.target.value) }))} required />
              <input className="rounded border px-3 py-2" placeholder="Subjects handled" type="number" min="0" value={form.subjectsHandled} onChange={(e) => setForm((prev) => ({ ...prev, subjectsHandled: Number(e.target.value) }))} required />
              <input className="rounded border px-3 py-2" placeholder="Attendance %" type="number" min="0" max="100" value={form.attendancePercentage} onChange={(e) => setForm((prev) => ({ ...prev, attendancePercentage: Number(e.target.value) }))} required />
              <input className="rounded border px-3 py-2" placeholder="Research publications" type="number" min="0" value={form.researchPublications} onChange={(e) => setForm((prev) => ({ ...prev, researchPublications: Number(e.target.value) }))} required />
              <input className="rounded border px-3 py-2" placeholder="Research impact score" type="number" min="0" step="0.01" value={form.researchImpactScore} onChange={(e) => setForm((prev) => ({ ...prev, researchImpactScore: Number(e.target.value) }))} />
              <input className="rounded border px-3 py-2" placeholder="Student feedback score" type="number" min="0" max="100" step="0.01" value={form.studentFeedbackScore} onChange={(e) => setForm((prev) => ({ ...prev, studentFeedbackScore: Number(e.target.value) }))} />
              <input className="rounded border px-3 py-2" placeholder="ML score" type="number" min="0" max="100" step="0.01" value={form.mlScore} onChange={(e) => setForm((prev) => ({ ...prev, mlScore: Number(e.target.value) }))} />
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
