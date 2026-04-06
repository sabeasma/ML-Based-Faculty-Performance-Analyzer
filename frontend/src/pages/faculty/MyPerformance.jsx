import { useEffect, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';
import { getMyPerformance } from '../../services/api';

export default function MyPerformance() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getMyPerformance().then(setProfile);
  }, []);

  return (
    <RolePageTemplate title="My Performance" description="Personal performance profile generated from feedback, attendance and research.">
      {profile && (
        <SectionCard title="Performance Summary">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 text-sm">
            <p><span className="font-semibold">Name:</span> {profile.full_name}</p>
            <p><span className="font-semibold">Department:</span> {profile.department}</p>
            <p><span className="font-semibold">ML Score:</span> <span className="font-semibold text-emerald-600">{profile.ml_score}</span></p>
            <p><span className="font-semibold">Feedback Score:</span> {profile.student_feedback_score}</p>
            <p><span className="font-semibold">Attendance:</span> {profile.attendance_percentage}%</p>
            <p><span className="font-semibold">Research Publications:</span> {profile.research_publications}</p>
          </div>
        </SectionCard>
      )}
    </RolePageTemplate>
  );
}
