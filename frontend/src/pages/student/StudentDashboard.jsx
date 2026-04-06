import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';

export default function StudentDashboard() {
  return (
    <RolePageTemplate title="Student Dashboard" description="Submit faculty and course feedback, and track your history.">
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
