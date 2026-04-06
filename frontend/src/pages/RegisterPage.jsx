import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/api';

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'hod', label: 'HOD' },
  { value: 'admin', label: 'Admin' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    departmentId: 1,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await registerRequest({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        departmentId: Number(form.departmentId),
      });
      setMessage('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-3xl p-8">
        <h1 className="font-display bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          Create Account
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">Register for role-based access to FacultyAI.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border p-3 dark:bg-slate-900/30"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border p-3 dark:bg-slate-900/30"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border p-3 dark:bg-slate-900/30"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
          />

          <select
            className="w-full rounded-xl border p-3 dark:bg-slate-900/30"
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            className="w-full rounded-xl border p-3 dark:bg-slate-900/30"
            type="number"
            min={1}
            max={8}
            placeholder="Department ID (1-8)"
            value={form.departmentId}
            onChange={(e) => update('departmentId', e.target.value)}
            required
          />

          <button
            className="w-full rounded-xl bg-indigo-600 p-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {message && <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-300">{message}</p>}
        {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
