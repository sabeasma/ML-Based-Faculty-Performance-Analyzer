import { useEffect, useMemo, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';
import { getFacultyList, getSubjects, submitFeedback } from '../../services/api';

const initialForm = {
  faculty_id: '',
  subject_id: '',
  semester: '2025_S1',
  rating_teaching: 0,
  rating_knowledge: 0,
  rating_communication: 0,
  rating_interaction: 0,
  course_difficulty: 0,
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

export default function FacultyFeedback() {
  const [form, setForm] = useState(initialForm);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [status, setStatus] = useState({ kind: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const loadOptions = async () => {
      const [faculty, subjects] = await Promise.all([getFacultyList(), getSubjects()]);
      setFacultyOptions(faculty);
      setSubjectOptions(subjects);
    };

    loadOptions().catch(() => {
      setStatus({ kind: 'error', message: 'Unable to load faculty and subject options.' });
    });
  }, []);

  const filteredSubjects = useMemo(() => {
    if (!form.faculty_id) {
      return subjectOptions;
    }

    const selectedFaculty = facultyOptions.find((item) => Number(item.faculty_id) === Number(form.faculty_id));
    if (!selectedFaculty) {
      return subjectOptions;
    }

    return subjectOptions.filter((subject) => subject.department === selectedFaculty.department);
  }, [form.faculty_id, facultyOptions, subjectOptions]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.faculty_id || !form.subject_id || !form.semester) {
      setStatus({ kind: 'error', message: 'Please select faculty, subject and semester.' });
      return;
    }

    const ratings = [
      form.rating_teaching,
      form.rating_knowledge,
      form.rating_communication,
      form.rating_interaction,
      form.course_difficulty,
    ];

    if (ratings.some((rating) => rating < 1 || rating > 5)) {
      setStatus({ kind: 'error', message: 'All rating fields must be selected with values from 1 to 5.' });
      return;
    }

    setSubmitting(true);
    setStatus({ kind: '', message: '' });

    try {
      await submitFeedback({
        ...form,
        faculty_id: Number(form.faculty_id),
        subject_id: Number(form.subject_id),
      });

      setStatus({ kind: 'success', message: 'Faculty feedback submitted successfully.' });
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
    <RolePageTemplate title="Faculty Feedback" description="Submit structured faculty feedback with rating-based academic evaluation.">
      <SectionCard title="Faculty Feedback Form">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Faculty Selection</label>
            <select
              value={form.faculty_id}
              onChange={(e) => update('faculty_id', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring dark:border-slate-600 dark:bg-slate-900"
            >
              <option value="">Select faculty</option>
              {facultyOptions.map((faculty) => (
                <option key={faculty.faculty_id} value={faculty.faculty_id}>
                  {faculty.full_name} ({faculty.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Subject Selection</label>
            <select
              value={form.subject_id}
              onChange={(e) => update('subject_id', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring dark:border-slate-600 dark:bg-slate-900"
            >
              <option value="">Select subject</option>
              {filteredSubjects.map((subject) => (
                <option key={subject.subject_id} value={subject.subject_id}>
                  {subject.code} - {subject.title}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
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
            id="teaching-quality"
            label="Teaching Quality"
            hint="How would you rate the faculty's teaching effectiveness?"
            value={form.rating_teaching}
            onChange={(value) => update('rating_teaching', value)}
          />
          <RatingField
            id="subject-knowledge"
            label="Subject Knowledge"
            hint="How well does the faculty understand the subject?"
            value={form.rating_knowledge}
            onChange={(value) => update('rating_knowledge', value)}
          />
          <RatingField
            id="communication-skills"
            label="Communication Skills"
            hint="How clearly does the faculty explain concepts?"
            value={form.rating_communication}
            onChange={(value) => update('rating_communication', value)}
          />
          <RatingField
            id="student-interaction"
            label="Student Interaction"
            hint="How effectively does the faculty interact with students?"
            value={form.rating_interaction}
            onChange={(value) => update('rating_interaction', value)}
          />
          <RatingField
            id="course-difficulty"
            label="Course Difficulty"
            hint="How difficult is the course taught by the faculty?"
            value={form.course_difficulty}
            onChange={(value) => update('course_difficulty', value)}
          />

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">Additional Comments</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none ring-indigo-200 focus:ring dark:border-slate-600 dark:bg-slate-900"
              rows={3}
              value={form.comments}
              onChange={(e) => update('comments', e.target.value)}
              placeholder="Share additional feedback"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400 md:col-span-2"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
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
