import { useEffect, useMemo, useState } from 'react';
import MetricCards from '../../components/common/MetricCards';
import AnalyticsCharts from '../../components/common/AnalyticsCharts';
import DataTable from '../../components/common/DataTable';
import SectionCard from '../../components/common/SectionCard';
import { contributionSplit, performanceTrend, skillRadar, subjectRatings } from '../../utils/chartData';
import { getDashboardAdmin, getFacultyById, getFacultyList, getRankings } from '../../services/api';

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [ov, rankRows, list] = await Promise.all([getDashboardAdmin(), getRankings(), getFacultyList()]);
      setOverview(ov);
      setRankings(rankRows);
      setFacultyList(list);
      if (list.length > 0) {
        const details = await getFacultyById(list[0].faculty_id);
        setProfile(details);
      }
    };
    load();
  }, []);

  const cards = useMemo(
    () => [
      { title: 'Total Faculty', value: overview?.total_faculty ?? '-', subtitle: 'Academic staff in system' },
      { title: 'Average Performance Score', value: overview?.average_performance ?? '-', subtitle: 'ML based institution average' },
      { title: 'Departments Covered', value: overview?.departments_covered ?? '-', subtitle: 'Departments tracked by analytics' },
      { title: 'Top Ranked Faculty', value: overview?.top_ranked_faculty ?? '-', subtitle: 'Highest ML score performer' },
    ],
    [overview]
  );

  const rankingRows = rankings.map((item) => ({
    id: item.faculty_id,
    rank: item.rank ?? item.ranking,
    facultyName: item.faculty_name,
    department: item.department,
    experience: `${item.years_of_experience} yrs`,
    mlScore: <span className="font-semibold text-emerald-600">{item.ml_score}</span>,
    trend: item.risk_level === 'low' ? 'Upward' : item.risk_level === 'medium' ? 'Stable' : 'Downward',
  }));

  return (
    <div className="space-y-4">
      <MetricCards items={cards} />

      <DataTable
        title="Faculty Ranking Leaderboard"
        columns={[
          { key: 'rank', label: 'Rank' },
          { key: 'facultyName', label: 'Faculty Name' },
          { key: 'department', label: 'Department' },
          { key: 'experience', label: 'Experience' },
          { key: 'mlScore', label: 'ML Score' },
          { key: 'trend', label: 'Trend' },
        ]}
        rows={rankingRows}
      />

      {profile && (
        <SectionCard title="Faculty Profile Panel">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 text-sm">
            <p><span className="font-semibold">Faculty Name:</span> {profile.full_name}</p>
            <p><span className="font-semibold">Department:</span> {profile.department}</p>
            <p><span className="font-semibold">Qualification:</span> {profile.qualification}</p>
            <p><span className="font-semibold">Experience:</span> {profile.years_of_experience} years</p>
            <p><span className="font-semibold">Subjects Handled:</span> {profile.subjects_handled}</p>
            <p><span className="font-semibold">Student Feedback Score:</span> {profile.student_feedback_score}</p>
            <p><span className="font-semibold">Attendance Percentage:</span> {profile.attendance_percentage}%</p>
            <p><span className="font-semibold">Research Publications:</span> {profile.research_publications}</p>
            <p><span className="font-semibold">Research Impact Score:</span> {profile.research_citations}</p>
            <p><span className="font-semibold">ML Score:</span> <span className="text-emerald-600 font-semibold">{profile.ml_score}</span></p>
          </div>
          <p className="mt-3 rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
            AI Summary: Faculty demonstrates excellent teaching effectiveness with strong student engagement and consistent research output.
          </p>
        </SectionCard>
      )}

      <AnalyticsCharts
        lineData={performanceTrend}
        barData={subjectRatings}
        pieData={contributionSplit}
        radarData={skillRadar}
        lineTitle="Faculty Performance Across Semesters"
        barTitle="Subject Wise Student Ratings"
        pieTitle="Contribution Distribution"
        radarTitle="Faculty Skill Analysis"
      />
    </div>
  );
}
