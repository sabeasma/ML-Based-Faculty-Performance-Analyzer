import { useEffect, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import DataTable from '../../components/common/DataTable';
import { getCourseFeedback, getFeedback } from '../../services/api';

export default function FeedbackHistory() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    Promise.all([getFeedback(), getCourseFeedback()])
      .then(([facultyFeedback, courseFeedback]) => {
        const facultyRows = facultyFeedback.map((item) => ({
          id: `faculty-${item.feedback_id}`,
          target: item.faculty_name,
          subject: item.subject_code,
          ratings: Number(item.avg_rating).toFixed(2),
          semester: item.semester,
          createdAt: item.created_at,
          date: new Date(item.created_at).toLocaleDateString(),
        }));

        const courseRows = courseFeedback.map((item) => ({
          id: `course-${item.course_feedback_id}`,
          target: `Course: ${item.course_code}`,
          subject: item.course_title,
          ratings: Number(item.rating_overall).toFixed(2),
          semester: item.semester,
          createdAt: item.created_at,
          date: new Date(item.created_at).toLocaleDateString(),
        }));

        const merged = [...facultyRows, ...courseRows]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 200);

        setRows(merged);
      })
      .catch(() => {
        setRows([]);
      });
  }, []);

  return (
    <RolePageTemplate title="My Feedback History" description="Review previously submitted feedback records.">
      <DataTable
        title="Feedback History"
        columns={[
          { key: 'target', label: 'Faculty / Course' },
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
