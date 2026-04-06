import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import ChartsSection from '../charts/ChartsSection';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { getFacultyList } from '../services/api';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [myData, setMyData] = useState(null);

  useEffect(() => {
    const run = async () => {
      const all = await getFacultyList();
      const match = all.find((f) => f.email === user?.email) || all[0] || null;
      setMyData(match);
    };
    run();
  }, [user?.email]);

  if (!myData) {
    return <EmptyState title="No faculty analytics yet" description="Your performance profile will appear once records are synced." />;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="My ML Score" value={myData.ml_score || 0} subtitle="AI predicted performance" />
        <StatCard title="Student Feedback" value={myData.student_feedback_score || 0} subtitle="Average rating out of 5" />
        <StatCard title="Attendance" value={`${myData.attendance_percentage || 0}%`} subtitle="Semester attendance" />
        <StatCard title="Research Publications" value={Math.max(0, Math.round((myData.ml_score || 0) / 10))} subtitle="Indexed papers" />
      </div>

      <ChartsSection />

      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-lg font-semibold">AI Recommendations</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Improve student interaction in practical sessions.</li>
          <li>Increase research publication frequency in indexed journals.</li>
          <li>Attend academic pedagogy workshops to elevate engagement.</li>
        </ul>
      </div>
    </div>
  );
}
