import AnalyticsCharts from '../../components/common/AnalyticsCharts';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { contributionSplit, performanceTrend, skillRadar, subjectRatings } from '../../utils/chartData';

export default function PerformanceAnalytics() {
  return (
    <RolePageTemplate title="Performance Analytics" description="Institution-wide performance trends powered by ML-assisted metrics.">
      <AnalyticsCharts
        lineData={performanceTrend}
        barData={subjectRatings}
        pieData={contributionSplit}
        radarData={skillRadar}
      />
    </RolePageTemplate>
  );
}
