import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';

export default function Reports() {
  return (
    <RolePageTemplate title="Reports" description="Generate academic performance summaries and exportables for governance.">
      <SectionCard title="Available Reports">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {['Faculty Performance Report', 'Department ML Trend Report', 'Feedback Sentiment Summary'].map((name) => (
            <button key={name} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500">
              {name}
            </button>
          ))}
        </div>
      </SectionCard>
    </RolePageTemplate>
  );
}
