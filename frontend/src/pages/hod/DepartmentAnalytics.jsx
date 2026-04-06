import RolePageTemplate from '../../components/common/RolePageTemplate';
import AnalyticsCharts from '../../components/common/AnalyticsCharts';
import { contributionSplit, performanceTrend, skillRadar, subjectRatings } from '../../utils/chartData';

export default function DepartmentAnalytics() {
  return (
    <RolePageTemplate title="Department Analytics" description="Department-level academic performance and ML trend analysis.">
      <AnalyticsCharts
        lineData={performanceTrend}
        barData={subjectRatings}
        pieData={contributionSplit}
        radarData={skillRadar}
      />
    </RolePageTemplate>
  );
}
