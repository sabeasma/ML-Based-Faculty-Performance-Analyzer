import { NavLink } from 'react-router-dom';
import { roleMenus } from '../utils/menuConfig';

export default function Sidebar({ role }) {
  const items = roleMenus[role] || [];

  return (
    <aside className="glass-card hidden w-72 shrink-0 rounded-3xl p-5 lg:block">
      <h2 className="font-display bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
        FacultyAI
      </h2>
      <p className="mt-1 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">{role} portal</p>

      <nav className="mt-8 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block w-full rounded-xl px-4 py-2 text-left text-sm transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
