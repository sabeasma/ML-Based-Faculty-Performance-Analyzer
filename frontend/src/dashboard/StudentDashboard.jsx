import { useState } from 'react';
import { submitFeedback } from '../services/api';

const initialForm = {
  studentId: 1,
  facultyId: 1,
  subjectId: 1,
  ratingTeaching: 4,
  ratingKnowledge: 4,
  ratingInteraction: 4,
  ratingCommunication: 4,
  comments: '',
  semester: '2025-ODD',
};

export default function StudentDashboard() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback({
        ...form,
        studentId: Number(form.studentId),
        facultyId: Number(form.facultyId),
        subjectId: Number(form.subjectId),
        ratingTeaching: Number(form.ratingTeaching),
        ratingKnowledge: Number(form.ratingKnowledge),
        ratingInteraction: Number(form.ratingInteraction),
        ratingCommunication: Number(form.ratingCommunication),
      });
      setStatus('Feedback submitted successfully.');
      setForm(initialForm);
    } catch {
      setStatus('Failed to submit feedback. Ensure your student account is logged in.');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-xl font-semibold">Faculty Feedback Form</h2>
      <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">Submit structured feedback to improve teaching quality.</p>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input className="rounded-xl border p-3 dark:bg-slate-900/30" placeholder="Student ID" value={form.studentId} onChange={(e) => update('studentId', e.target.value)} />
        <input className="rounded-xl border p-3 dark:bg-slate-900/30" placeholder="Faculty ID" value={form.facultyId} onChange={(e) => update('facultyId', e.target.value)} />
        <input className="rounded-xl border p-3 dark:bg-slate-900/30" placeholder="Subject ID" value={form.subjectId} onChange={(e) => update('subjectId', e.target.value)} />
        <input className="rounded-xl border p-3 dark:bg-slate-900/30" placeholder="Semester" value={form.semester} onChange={(e) => update('semester', e.target.value)} />

        {[
          ['ratingTeaching', 'Teaching Quality (1-5)'],
          ['ratingKnowledge', 'Subject Knowledge (1-5)'],
          ['ratingInteraction', 'Interaction (1-5)'],
          ['ratingCommunication', 'Communication (1-5)'],
        ].map(([key, label]) => (
          <input
            key={key}
            className="rounded-xl border p-3 dark:bg-slate-900/30"
            placeholder={label}
            value={form[key]}
            onChange={(e) => update(key, e.target.value)}
          />
        ))}

        <textarea
          className="rounded-xl border p-3 md:col-span-2 dark:bg-slate-900/30"
          rows={4}
          placeholder="Comments"
          value={form.comments}
          onChange={(e) => update('comments', e.target.value)}
        />

        <button className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 md:col-span-2" type="submit">
          Submit Feedback
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-indigo-600 dark:text-indigo-300">{status}</p>}
    </div>
  );
}
