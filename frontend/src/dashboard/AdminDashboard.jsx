import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Leaderboard from '../components/Leaderboard';
import ChartsSection from '../charts/ChartsSection';
import { getAdminOverview, getModelMetrics, getRankings } from '../services/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const [ov, rk, mm] = await Promise.all([getAdminOverview(), getRankings(), getModelMetrics()]);
        setOverview(ov);
        setRankings(rk);
        setMetrics(mm);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Faculty" value={overview?.total_faculty || 0} subtitle="Active teaching staff" delay={0.05} />
        <StatCard title="Average Performance Score" value={overview?.average_performance || 0} subtitle="AI derived score" delay={0.1} />
        <StatCard title="Departments Covered" value={overview?.departments_covered || 0} subtitle="Institution-wide visibility" delay={0.15} />
        <StatCard title="Top Ranked Faculty" value={overview?.top_ranked_faculty || '-'} subtitle={`Model R2: ${metrics?.r2?.toFixed?.(3) || '-'}`} delay={0.2} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartsSection />
        </div>
        <Leaderboard data={rankings.slice(0, 25)} />
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-lg font-semibold">AI Summary</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Faculty demonstrates excellent teaching effectiveness with strong student engagement and consistent research output.
          Risk segmentation indicates majority low-risk profiles, with targeted interventions recommended for medium-risk cohorts.
        </p>
      </div>
    </div>
  );
}
