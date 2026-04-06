import SectionCard from './SectionCard';

export default function RolePageTemplate({ title, description, children }) {
  return (
    <div className="space-y-4">
      <SectionCard title={title}>
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </SectionCard>
      {children}
    </div>
  );
}
