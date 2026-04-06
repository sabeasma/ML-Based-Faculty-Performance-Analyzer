export default function DataTable({ title, columns, rows }) {
  return (
    <section className="glass-card rounded-xl p-4 shadow-md">
      <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <div className="scroll-thin overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="border-b border-slate-100 dark:border-slate-800">
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column.key}`} className="px-3 py-2 text-slate-700 dark:text-slate-200">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
