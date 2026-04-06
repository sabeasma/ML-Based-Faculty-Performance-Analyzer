import RolePageTemplate from '../../components/common/RolePageTemplate';
import DataTable from '../../components/common/DataTable';

const rows = [
  { id: 1, faculty: 'Dr Kumar', papers: 12, citations: 220, impact: 8.1 },
  { id: 2, faculty: 'Dr Meena', papers: 10, citations: 180, impact: 7.5 },
  { id: 3, faculty: 'Dr Ravi', papers: 8, citations: 155, impact: 6.9 },
];

export default function ResearchPublications() {
  return (
    <RolePageTemplate title="Research Publications" description="Track publication count, citations and department-wise impact.">
      <DataTable
        title="Research Output"
        columns={[
          { key: 'faculty', label: 'Faculty' },
          { key: 'papers', label: 'Publications' },
          { key: 'citations', label: 'Citations' },
          { key: 'impact', label: 'Impact Score' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
