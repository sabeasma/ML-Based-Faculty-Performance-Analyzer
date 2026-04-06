import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';

export default function AttendanceMetrics() {
  return (
    <RolePageTemplate title="Attendance Metrics" description="Track attendance consistency and semester-wise participation.">
      <SectionCard title="Attendance Highlights">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">Current Semester: <span className="font-semibold">91.2%</span></div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">Previous Semester: <span className="font-semibold">88.5%</span></div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">Overall Trend: <span className="font-semibold text-emerald-600">Improving</span></div>
        </div>
      </SectionCard>
    </RolePageTemplate>
  );
}
