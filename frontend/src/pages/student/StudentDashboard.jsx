import { useEffect, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';
import { getDashboardStudent } from '../../services/api';

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    courses_enrolled: 0,
    feedback_pending: 0,
    feedback_submitted: 0,
  });

  useEffect(() => {
    getDashboardStudent().then(setStats).catch(() => {});
  }, []);

  return (
    <RolePageTemplate title="Student Dashboard" description="Submit faculty and course feedback, and track your history.">
      <SectionCard title="Overview">
        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">Courses enrolled: {stats.courses_enrolled}</div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">Feedback pending: {stats.feedback_pending}</div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">Feedback submitted: {stats.feedback_submitted}</div>
        </div>
      </SectionCard>
      <SectionCard title="Quick Actions">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">Submit Faculty Feedback</div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">Submit Course Feedback</div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">View My Feedback History</div>
        </div>
      </SectionCard>
    </RolePageTemplate>
  );
}
