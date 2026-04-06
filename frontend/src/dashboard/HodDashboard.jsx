import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import ChartsSection from '../charts/ChartsSection';
import { getFacultyList, getHodOverview } from '../services/api';

export default function HodDashboard() {
  const [overview, setOverview] = useState({});
  const [topFaculty, setTopFaculty] = useState([]);

  useEffect(() => {
    const run = async () => {
      const [ov, faculty] = await Promise.all([getHodOverview(), getFacultyList()]);
      setOverview(ov);
      setTopFaculty(faculty.slice(0, 5));
    };
    run();
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Faculty Count" value={overview.faculty_count || 0} subtitle="Department staff" />
        <StatCard title="Department Average" value={overview.department_average_score || 0} subtitle="ML weighted score" />
        <StatCard title="Top Faculty" value={topFaculty[0]?.full_name || '-'} subtitle="Best performing faculty" />
        <StatCard title="Research Output" value={overview.research_output || 0} subtitle="Total citations" />
      </div>

      <ChartsSection />

      <div className="glass-card rounded-2xl p-5">
        <h3 className="mb-3 text-lg font-semibold">Department Rankings</h3>
        <div className="space-y-3">
          {topFaculty.map((fac, idx) => (
            <div key={fac.faculty_id} className="flex items-center justify-between rounded-xl bg-white/65 px-4 py-3 dark:bg-slate-800/60">
              <p className="font-medium">#{idx + 1} {fac.full_name}</p>
              <p className="font-semibold text-indigo-600 dark:text-indigo-300">{fac.ml_score}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
