import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';
import RadarChart from '../../charts/RadarChart';
import { skillRadar } from '../../utils/chartData';

export default function SkillAnalysis() {
  return (
    <RolePageTemplate title="Skill Analysis" description="Understand strengths and improvement areas from skill analytics.">
      <SectionCard title="Skill Radar">
        <RadarChart data={skillRadar} />
      </SectionCard>
    </RolePageTemplate>
  );
}
