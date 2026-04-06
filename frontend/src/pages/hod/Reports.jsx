import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';
import { downloadReport, generateReport, getReports } from '../../services/api';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [busy, setBusy] = useState('');
  const [format, setFormat] = useState('csv');

  const triggerDownload = (blob, fallbackFileName, contentDisposition) => {
    const match = /filename="?([^";]+)"?/i.exec(contentDisposition || '');
    const fileName = match?.[1] || fallbackFileName;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const loadReports = async () => {
    const data = await getReports();
    setReports(
      data.map((report) => ({
        id: report.report_id,
        type: report.report_type,
        format: report.format,
        file: report.file_name,
        created: new Date(report.created_at).toLocaleString(),
        action: (
          <button
            type="button"
            onClick={async () => {
              const downloaded = await downloadReport(report.report_id);
              triggerDownload(downloaded.blob, report.file_name, downloaded.contentDisposition);
            }}
            className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Download
          </button>
        ),
      }))
    );
  };

  const generate = async (reportType) => {
    setBusy(reportType);
    try {
      await generateReport(reportType, format);
      await loadReports();
    } finally {
      setBusy('');
    }
  };

  useEffect(() => {
    loadReports().catch(() => {});
  }, []);

  return (
    <RolePageTemplate title="Reports" description="Generate department snapshots for internal review.">
      <SectionCard title="Department Reports">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Format</span>
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <button
            type="button"
            disabled={busy.length > 0}
            onClick={() => generate('department_performance')}
            className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {busy === 'department_performance' ? 'Generating...' : `Export Department Performance ${format.toUpperCase()}`}
          </button>
          <button
            type="button"
            disabled={busy.length > 0}
            onClick={() => generate('research_analytics')}
            className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {busy === 'research_analytics' ? 'Generating...' : `Export Research Output Summary ${format.toUpperCase()}`}
          </button>
        </div>
      </SectionCard>
      <DataTable
        title="Generated Reports"
        columns={[
          { key: 'type', label: 'Type' },
          { key: 'format', label: 'Format' },
          { key: 'file', label: 'File Name' },
          { key: 'created', label: 'Generated At' },
          { key: 'action', label: 'Download' },
        ]}
        rows={reports}
      />
    </RolePageTemplate>
  );
}
