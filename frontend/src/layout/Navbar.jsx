import { Bell, ChevronDown, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getNotifications, markNotificationsRead } from '../services/api';

export default function Navbar({ darkMode, setDarkMode, userName, onLogout }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((item) => Number(item.is_read) === 0).length,
    [notifications]
  );

  useEffect(() => {
    getNotifications().then(setNotifications).catch(() => setNotifications([]));
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleBellClick = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    if (nextOpen && unreadCount > 0) {
      await markNotificationsRead();
      const refreshed = await getNotifications();
      setNotifications(refreshed);
    }
  };

  return (
    <header className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
      <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200 md:flex">
        MLFA
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
        <Search size={16} className="text-slate-500" />
        <input className="w-40 bg-transparent outline-none md:w-72" placeholder="Search faculty, reports, analytics..." />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={bellRef}>
          <button
            onClick={handleBellClick}
            className="relative rounded-full bg-slate-100 p-2 transition hover:scale-105 dark:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold">Notifications</h4>
                <span className="text-xs text-slate-500">Recent</span>
              </div>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500">No notifications available.</p>
                ) : (
                  notifications.slice(0, 12).map((item) => (
                    <div
                      key={item.notification_id}
                      className={`rounded-lg border p-2 text-xs ${Number(item.is_read) ? 'border-slate-200 dark:border-slate-700' : 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/30'}`}
                    >
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{item.message}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="rounded-full bg-slate-100 p-2 transition hover:scale-105 dark:bg-slate-800"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-1 rounded-xl bg-slate-100 px-2 py-1.5 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100"
          >
            <span className="hidden sm:inline">{userName}</span>
            <ChevronDown size={14} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <button
                onClick={onLogout}
                className="w-full rounded-lg bg-rose-500 px-3 py-2 text-left text-xs font-semibold text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
