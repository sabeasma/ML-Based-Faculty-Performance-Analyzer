import { useEffect, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import DataTable from '../../components/common/DataTable';
import { getFeedback } from '../../services/api';

export default function FeedbackAnalysis() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getFeedback().then((data) => {
      setRows(
        data.slice(0, 80).map((item) => ({
          id: item.feedback_id,
          faculty: item.faculty_name,
          subject: item.subject_code,
          rating: Number(item.avg_rating).toFixed(2),
          semester: item.semester,
        }))
      );
    });
  }, []);

  return (
    <RolePageTemplate title="Feedback Analysis" description="Review department feedback trends and student sentiment signals.">
      <DataTable
        title="Feedback Overview"
        columns={[
          { key: 'faculty', label: 'Faculty' },
          { key: 'subject', label: 'Subject' },
          { key: 'rating', label: 'Avg Rating' },
          { key: 'semester', label: 'Semester' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
