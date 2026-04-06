import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { getFeedback } from '../../services/api';

export default function FeedbackAnalysis() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getFeedback().then((data) => {
      setRows(
        data.slice(0, 100).map((item) => ({
          id: item.feedback_id,
          faculty: item.faculty_name,
          subject: item.subject_code,
          rating: Number(item.avg_rating).toFixed(2),
          semester: item.semester,
          date: new Date(item.created_at).toLocaleDateString(),
        }))
      );
    });
  }, []);

  return (
    <RolePageTemplate title="Student Feedback Analysis" description="Analyze student sentiment and rating quality across faculty and subjects.">
      <DataTable
        title="Feedback Insights"
        columns={[
          { key: 'faculty', label: 'Faculty' },
          { key: 'subject', label: 'Subject' },
          { key: 'rating', label: 'Avg Rating' },
          { key: 'semester', label: 'Semester' },
          { key: 'date', label: 'Date' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
