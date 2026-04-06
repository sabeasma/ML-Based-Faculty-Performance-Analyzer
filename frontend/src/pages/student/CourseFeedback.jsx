import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';

export default function CourseFeedback() {
  return (
    <RolePageTemplate title="Course Feedback" description="Submit course-level feedback for curriculum and delivery quality.">
      <SectionCard title="Course Feedback Form">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This page is ready for course-specific form fields and can reuse the same submission model as Faculty Feedback.
        </p>
      </SectionCard>
    </RolePageTemplate>
  );
}
