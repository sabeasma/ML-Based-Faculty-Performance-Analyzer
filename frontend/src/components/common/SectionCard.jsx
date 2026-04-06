export default function SectionCard({ title, children }) {
  return (
    <section className="glass-card rounded-xl p-4 shadow-md transition-transform hover:-translate-y-0.5">
      <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      {children}
    </section>
  );
}
