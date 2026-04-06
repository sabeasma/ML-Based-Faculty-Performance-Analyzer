import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';

export default function AIRecommendations() {
  return (
    <RolePageTemplate title="AI Recommendations" description="Actionable AI recommendations to improve teaching and research outcomes.">
      <SectionCard title="Recommendations">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Improve student engagement with active learning activities.</li>
          <li>Increase research publications in high-impact journals.</li>
          <li>Attend academic workshops for pedagogy and innovation.</li>
        </ul>
      </SectionCard>
    </RolePageTemplate>
  );
}
