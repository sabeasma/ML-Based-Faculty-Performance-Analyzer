import { useEffect, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';
import { getSubjects, submitCourseFeedback } from '../../services/api';

const initialForm = {
  course_id: '',
  semester: '2025_S1',
  rating_content: 0,
  rating_difficulty: 0,
  rating_resources: 0,
  rating_organization: 0,
  rating_overall: 0,
  comments: '',
};

const semesterOptions = ['2024_S1', '2024_S2', '2025_S1', '2025_S2', '2026_S1'];

function RatingField({ id, label, hint, value, onChange }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring dark:border-slate-600 dark:bg-slate-900"
      >
        <option value={0}>Select rating (1-5)</option>
        {[1, 2, 3, 4, 5].map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default function CourseFeedback() {
  const [form, setForm] = useState(initialForm);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [status, setStatus] = useState({ kind: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    getSubjects().then(setSubjectOptions).catch(() => {
      setStatus({ kind: 'error', message: 'Unable to load course options.' });
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.course_id || !form.semester) {
      setStatus({ kind: 'error', message: 'Please select course and semester.' });
      return;
    }

    const ratings = [
      form.rating_content,
      form.rating_difficulty,
      form.rating_resources,
      form.rating_organization,
      form.rating_overall,
    ];
    if (ratings.some((rating) => rating < 1 || rating > 5)) {
      setStatus({ kind: 'error', message: 'All rating fields must be selected with values from 1 to 5.' });
      return;
    }

    setSubmitting(true);
    setStatus({ kind: '', message: '' });
    try {
      await submitCourseFeedback({
        ...form,
        course_id: Number(form.course_id),
      });
      setStatus({ kind: 'success', message: 'Course feedback submitted successfully.' });
      setForm(initialForm);
    } catch (error) {
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      setStatus({
        kind: 'error',
        message: serverMessage || 'Submission failed. Please review your entries and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RolePageTemplate title="Course Feedback" description="Submit course-level feedback for syllabus quality and delivery experience.">
      <SectionCard title="Course Feedback Form">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Course Selection</label>
            <select
              value={form.course_id}
              onChange={(e) => update('course_id', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring dark:border-slate-600 dark:bg-slate-900"
            >
              <option value="">Select course</option>
              {subjectOptions.map((subject) => (
                <option key={subject.subject_id} value={subject.subject_id}>
                  {subject.code} - {subject.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Semester</label>
            <select
              value={form.semester}
              onChange={(e) => update('semester', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring dark:border-slate-600 dark:bg-slate-900"
            >
              {semesterOptions.map((semester) => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          <RatingField
            id="content-quality"
            label="Course Content Quality"
            hint="How well structured is the course syllabus?"
            value={form.rating_content}
            onChange={(value) => update('rating_content', value)}
          />
          <RatingField
            id="difficulty"
            label="Course Difficulty"
            hint="How challenging is the course?"
            value={form.rating_difficulty}
            onChange={(value) => update('rating_difficulty', value)}
          />
          <RatingField
            id="resources"
            label="Learning Resources"
            hint="How useful are the course materials?"
            value={form.rating_resources}
            onChange={(value) => update('rating_resources', value)}
          />
          <RatingField
            id="organization"
            label="Course Organization"
            hint="How well organized is the course delivery?"
            value={form.rating_organization}
            onChange={(value) => update('rating_organization', value)}
          />
          <RatingField
            id="overall"
            label="Overall Course Satisfaction"
            hint="Overall rating of the course."
            value={form.rating_overall}
            onChange={(value) => update('rating_overall', value)}
          />

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Comments</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none ring-indigo-200 focus:ring dark:border-slate-600 dark:bg-slate-900"
              rows={3}
              value={form.comments}
              onChange={(e) => update('comments', e.target.value)}
              placeholder="Share feedback about the course structure and learning outcomes"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400 md:col-span-2"
          >
            {submitting ? 'Submitting...' : 'Submit Course Feedback'}
          </button>
        </form>

        {status.message && (
          <p className={`mt-3 text-sm ${status.kind === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {status.message}
          </p>
        )}
      </SectionCard>
    </RolePageTemplate>
  );
}
