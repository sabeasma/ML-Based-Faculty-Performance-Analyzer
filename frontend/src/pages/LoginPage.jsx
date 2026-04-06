import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const redirects = {
  admin: '/admin',
  hod: '/hod',
  faculty: '/faculty',
  student: '/student',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      navigate(redirects[data.role] || '/admin');
    } catch {
      setError('Invalid credentials. Try admin@college.edu / admin123');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-3xl p-8">
        <h1 className="font-display bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          ML Faculty Analyzer
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">AI-Powered Academic Analytics Platform</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border p-3 dark:bg-slate-900/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full rounded-xl border p-3 dark:bg-slate-900/30"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="w-full rounded-xl bg-indigo-600 p-3 font-semibold text-white transition hover:bg-indigo-500" type="submit">
            Sign In
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-slate-100/70 p-3 text-xs dark:bg-slate-800/70">
          <p>Demo logins:</p>
          <p>Admin: admin@college.edu / admin123</p>
          <p>HOD: hod1@college.edu / hod123</p>
          <p>Faculty: faculty1@college.edu / faculty123</p>
          <p>Student: student1@college.edu / student123</p>
        </div>

        {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
          New user?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
