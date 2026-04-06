import { useEffect, useMemo, useState } from 'react';
import MetricCards from '../../components/common/MetricCards';
import AnalyticsCharts from '../../components/common/AnalyticsCharts';
import { contributionSplit, performanceTrend, skillRadar, subjectRatings } from '../../utils/chartData';
import { getDashboardFaculty } from '../../services/api';

export default function FacultyDashboard() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getDashboardFaculty().then(setOverview);
  }, []);

  const cards = useMemo(
    () => [
      { title: 'My ML Score', value: overview?.ml_score ?? '-', subtitle: 'Current predicted score' },
      { title: 'Student Feedback Rating', value: overview?.student_feedback ?? '-', subtitle: 'Average rating out of 5' },
      { title: 'Attendance Percentage', value: overview?.attendance_percentage ? `${overview.attendance_percentage}%` : '-', subtitle: 'Current semester attendance' },
      { title: 'Research Publications', value: overview?.research_publications ?? '-', subtitle: 'Tracked publications' },
    ],
    [overview]
  );

  return (
    <div className="space-y-4">
      <MetricCards items={cards} />
      <AnalyticsCharts
        lineData={performanceTrend}
        barData={subjectRatings}
        pieData={contributionSplit}
        radarData={skillRadar}
        lineTitle="Performance Trend"
        barTitle="Subject Rating Chart"
        pieTitle="Teaching vs Research Contribution"
        radarTitle="Skill Radar"
      />
    </div>
  );
}
