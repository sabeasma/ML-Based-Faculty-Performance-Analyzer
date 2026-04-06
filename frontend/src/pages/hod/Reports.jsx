import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';

export default function Reports() {
  return (
    <RolePageTemplate title="Reports" description="Generate department snapshots for internal review.">
      <SectionCard title="Department Reports">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <button className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500">
            Export Department Performance PDF
          </button>
          <button className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500">
            Export Research Output Summary
          </button>
        </div>
      </SectionCard>
    </RolePageTemplate>
  );
}
