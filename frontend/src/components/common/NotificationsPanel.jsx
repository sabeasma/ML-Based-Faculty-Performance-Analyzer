import SectionCard from './SectionCard';

export default function NotificationsPanel({ items, loading, onMarkAllRead }) {
  return (
    <SectionCard title="Notifications">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-300">Recent platform alerts and updates.</p>
          <button
            type="button"
            onClick={onMarkAllRead}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
          >
            Mark all as read
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading notifications...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No notifications yet.</p>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.notification_id}
                className={`rounded-lg border p-3 text-sm ${item.is_read ? 'border-slate-200 dark:border-slate-700' : 'border-indigo-300 bg-indigo-50/60 dark:border-indigo-700 dark:bg-indigo-900/20'}`}
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                  <span className="text-xs uppercase tracking-wide text-slate-500">{item.category}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{item.message}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
