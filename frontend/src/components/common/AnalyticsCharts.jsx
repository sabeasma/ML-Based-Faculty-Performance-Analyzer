import SectionCard from './SectionCard';
import LineChart from '../../charts/LineChart';
import BarChart from '../../charts/BarChart';
import PieChart from '../../charts/PieChart';
import RadarChart from '../../charts/RadarChart';

export default function AnalyticsCharts({
  lineData,
  barData,
  pieData,
  radarData,
  lineTitle = 'Performance Trend',
  barTitle = 'Subject Ratings',
  pieTitle = 'Contribution Distribution',
  radarTitle = 'Skill Analysis',
}) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <SectionCard title={lineTitle}>
        <LineChart data={lineData} xKey="name" yKey="value" />
      </SectionCard>
      <SectionCard title={barTitle}>
        <BarChart data={barData} xKey="name" yKey="value" />
      </SectionCard>
      <SectionCard title={pieTitle}>
        <PieChart data={pieData} />
      </SectionCard>
      <SectionCard title={radarTitle}>
        <RadarChart data={radarData} />
      </SectionCard>
    </div>
  );
}
