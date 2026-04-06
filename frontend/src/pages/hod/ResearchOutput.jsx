import RolePageTemplate from '../../components/common/RolePageTemplate';
import DataTable from '../../components/common/DataTable';

const rows = [
  { id: 1, area: 'Journals', count: 48, impact: 7.9 },
  { id: 2, area: 'Conferences', count: 36, impact: 6.8 },
  { id: 3, area: 'Patents', count: 6, impact: 8.4 },
];

export default function ResearchOutput() {
  return (
    <RolePageTemplate title="Research Output" description="Monitor department research productivity and publication impact.">
      <DataTable
        title="Research Metrics"
        columns={[
          { key: 'area', label: 'Category' },
          { key: 'count', label: 'Count' },
          { key: 'impact', label: 'Impact Score' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
