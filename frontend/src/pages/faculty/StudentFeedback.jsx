import { useEffect, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import DataTable from '../../components/common/DataTable';
import { getFeedback } from '../../services/api';

export default function StudentFeedback() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getFeedback().then((data) => {
      setRows(
        data.slice(0, 70).map((item) => ({
          id: item.feedback_id,
          subject: item.subject_code,
          rating: Number(item.avg_rating).toFixed(2),
          semester: item.semester,
          comments: item.comments || 'N/A',
        }))
      );
    });
  }, []);

  return (
    <RolePageTemplate title="Student Feedback" description="Review detailed student feedback responses for your teaching sessions.">
      <DataTable
        title="Feedback Responses"
        columns={[
          { key: 'subject', label: 'Subject' },
          { key: 'rating', label: 'Rating' },
          { key: 'semester', label: 'Semester' },
          { key: 'comments', label: 'Comments' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
