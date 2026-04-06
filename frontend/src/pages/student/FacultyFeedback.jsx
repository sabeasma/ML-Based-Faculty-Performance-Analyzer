import { useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';
import { submitFeedback } from '../../services/api';

const initialForm = {
  student_id: 1,
  faculty_id: 1,
  subject_id: 1,
  rating_teaching: 4,
  rating_knowledge: 4,
  rating_communication: 4,
  rating_interaction: 4,
  comments: '',
  semester: '2025_S1',
};

export default function FacultyFeedback() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback({
        ...form,
        student_id: Number(form.student_id),
        faculty_id: Number(form.faculty_id),
        subject_id: Number(form.subject_id),
        rating_teaching: Number(form.rating_teaching),
        rating_knowledge: Number(form.rating_knowledge),
        rating_communication: Number(form.rating_communication),
        rating_interaction: Number(form.rating_interaction),
      });
      setStatus('Feedback submitted successfully');
      setForm(initialForm);
    } catch {
      setStatus('Submission failed. Check login and values.');
    }
  };

  return (
    <RolePageTemplate title="Faculty Feedback" description="Submit structured feedback for faculty teaching quality.">
      <SectionCard title="Feedback Form">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded-xl border p-3 dark:bg-slate-900/20" value={form.student_id} onChange={(e) => update('student_id', e.target.value)} placeholder="Student ID" />
          <input className="rounded-xl border p-3 dark:bg-slate-900/20" value={form.faculty_id} onChange={(e) => update('faculty_id', e.target.value)} placeholder="Faculty ID" />
          <input className="rounded-xl border p-3 dark:bg-slate-900/20" value={form.subject_id} onChange={(e) => update('subject_id', e.target.value)} placeholder="Subject ID" />
          <input className="rounded-xl border p-3 dark:bg-slate-900/20" value={form.semester} onChange={(e) => update('semester', e.target.value)} placeholder="Semester" />
          <input className="rounded-xl border p-3 dark:bg-slate-900/20" value={form.rating_teaching} onChange={(e) => update('rating_teaching', e.target.value)} placeholder="Teaching Quality (1-5)" />
          <input className="rounded-xl border p-3 dark:bg-slate-900/20" value={form.rating_knowledge} onChange={(e) => update('rating_knowledge', e.target.value)} placeholder="Subject Knowledge (1-5)" />
          <input className="rounded-xl border p-3 dark:bg-slate-900/20" value={form.rating_communication} onChange={(e) => update('rating_communication', e.target.value)} placeholder="Communication (1-5)" />
          <input className="rounded-xl border p-3 dark:bg-slate-900/20" value={form.rating_interaction} onChange={(e) => update('rating_interaction', e.target.value)} placeholder="Interaction (1-5)" />
          <textarea className="rounded-xl border p-3 md:col-span-2 dark:bg-slate-900/20" rows={3} value={form.comments} onChange={(e) => update('comments', e.target.value)} placeholder="Comments" />
          <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 md:col-span-2">
            Submit Feedback
          </button>
        </form>
        {status && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{status}</p>}
      </SectionCard>
    </RolePageTemplate>
  );
}
