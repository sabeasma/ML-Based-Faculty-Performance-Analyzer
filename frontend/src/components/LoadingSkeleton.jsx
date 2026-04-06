export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="glass-card h-28 animate-pulse rounded-2xl bg-slate-200/40 dark:bg-slate-700/40" />
      ))}
    </div>
  );
}
