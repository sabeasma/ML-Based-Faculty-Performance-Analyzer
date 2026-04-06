import { useEffect, useMemo, useState } from 'react';
import MetricCards from '../../components/common/MetricCards';
import AnalyticsCharts from '../../components/common/AnalyticsCharts';
import DataTable from '../../components/common/DataTable';
import { contributionSplit, performanceTrend, subjectRatings, skillRadar } from '../../utils/chartData';
import { getDashboardHod, getDepartmentFaculty } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function HodDashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [facultyRows, setFacultyRows] = useState([]);

  useEffect(() => {
    const depId = user?.departmentId || 1;
    Promise.all([getDashboardHod(), getDepartmentFaculty(depId)]).then(([ov, faculty]) => {
      setOverview(ov);
      setFacultyRows(faculty);
    });
  }, [user?.departmentId]);

  const cards = useMemo(
    () => [
      { title: 'Faculty Count', value: overview?.faculty_count ?? '-', subtitle: 'Department faculty' },
      { title: 'Department Average Score', value: overview?.department_average_score ?? '-', subtitle: 'Average ML score' },
      { title: 'Top Faculty', value: facultyRows[0]?.full_name ?? '-', subtitle: 'Highest score in department' },
      { title: 'Research Output', value: overview?.research_output ?? '-', subtitle: 'Citations and publications impact' },
    ],
    [overview, facultyRows]
  );

  return (
    <div className="space-y-4">
      <MetricCards items={cards} />

      <DataTable
        title="Department Faculty"
        columns={[
          { key: 'full_name', label: 'Faculty' },
          { key: 'years_of_experience', label: 'Experience' },
          { key: 'student_feedback_score', label: 'Feedback' },
          { key: 'attendance_percentage', label: 'Attendance' },
          { key: 'ml_score', label: 'ML Score' },
        ]}
        rows={facultyRows}
      />

      <AnalyticsCharts
        lineData={performanceTrend}
        barData={subjectRatings}
        pieData={contributionSplit}
        radarData={skillRadar}
        lineTitle="Department Performance Trend"
        barTitle="Subject Ratings"
        pieTitle="Research Contribution"
        radarTitle="Department Skill Footprint"
      />
    </div>
  );
}
