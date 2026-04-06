export default function EmptyState({ title, description }) {
  return (
    <div className="glass-card rounded-2xl border border-dashed border-indigo-300/40 p-10 text-center dark:border-indigo-300/20">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
