import { Bell, Moon, Search, Sun } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode, userName, onLogout }) {
  return (
    <header className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
      <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        <Search size={16} className="text-slate-500" />
        <input className="w-40 bg-transparent outline-none md:w-72" placeholder="Search faculty, reports, analytics..." />
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-full bg-slate-100 p-2 transition hover:scale-105 dark:bg-slate-800">
          <Bell size={18} />
        </button>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="rounded-full bg-slate-100 p-2 transition hover:scale-105 dark:bg-slate-800"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{userName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Profile</p>
        </div>
        <button onClick={onLogout} className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white">
          Logout
        </button>
      </div>
    </header>
  );
}
