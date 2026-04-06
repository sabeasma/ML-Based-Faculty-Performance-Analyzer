import RolePageTemplate from '../../components/common/RolePageTemplate';
import DataTable from '../../components/common/DataTable';

const rows = [
  { id: 1, title: 'Adaptive ML in Education', type: 'Journal', citations: 42 },
  { id: 2, title: 'Student-Centric Analytics', type: 'Conference', citations: 28 },
  { id: 3, title: 'AI-Based Mentoring Models', type: 'Journal', citations: 31 },
];

export default function ResearchProfile() {
  return (
    <RolePageTemplate title="Research Profile" description="Track your research publications, citations and impact.">
      <DataTable
        title="Research Publications"
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'type', label: 'Type' },
          { key: 'citations', label: 'Citations' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
