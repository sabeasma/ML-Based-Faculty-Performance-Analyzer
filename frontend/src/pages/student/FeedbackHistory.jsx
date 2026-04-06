import { useEffect, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import DataTable from '../../components/common/DataTable';
import { getFeedback } from '../../services/api';

export default function FeedbackHistory() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getFeedback().then((data) => {
      setRows(
        data.slice(0, 120).map((item) => ({
          id: item.feedback_id,
          facultyName: item.faculty_name,
          subject: item.subject_code,
          ratings: Number(item.avg_rating).toFixed(2),
          semester: item.semester,
          date: new Date(item.created_at).toLocaleDateString(),
        }))
      );
    });
  }, []);

  return (
    <RolePageTemplate title="My Feedback History" description="Review previously submitted feedback records.">
      <DataTable
        title="Feedback History"
        columns={[
          { key: 'facultyName', label: 'Faculty Name' },
          { key: 'subject', label: 'Subject' },
          { key: 'ratings', label: 'Ratings' },
          { key: 'semester', label: 'Semester' },
          { key: 'date', label: 'Date' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
