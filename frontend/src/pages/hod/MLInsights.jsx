import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';

export default function MLInsights() {
  return (
    <RolePageTemplate title="ML Insights" description="Department-specific model signals for planning interventions.">
      <SectionCard title="AI Recommendations">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Mentoring programs should focus on medium-score faculty segments.</li>
          <li>Attendance and interaction are top indicators for immediate score lift.</li>
          <li>Research mentorship boosts long-term promotion eligibility.</li>
        </ul>
      </SectionCard>
    </RolePageTemplate>
  );
}
