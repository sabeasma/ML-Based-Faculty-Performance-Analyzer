import { useEffect, useMemo, useState } from 'react';

export default function DataTable({
  title,
  columns,
  rows,
  pageSize = 10,
  page: currentPageProp,
  totalRows,
  onPageChange,
  serverPagination = false,
}) {
  const [localPage, setLocalPage] = useState(1);

  const currentPage = serverPagination ? Math.max(1, Number(currentPageProp || 1)) : localPage;
  const totalCount = serverPagination ? Math.max(0, Number(totalRows || 0)) : rows.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (serverPagination) {
      return;
    }
    setLocalPage(1);
  }, [rows, pageSize, serverPagination]);

  useEffect(() => {
    if (serverPagination) {
      return;
    }
    if (localPage > totalPages) {
      setLocalPage(totalPages);
    }
  }, [localPage, totalPages, serverPagination]);

  const paginatedRows = useMemo(() => {
    if (serverPagination) {
      return rows;
    }

    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, currentPage, pageSize, serverPagination]);

  const startRow = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = totalCount === 0 ? 0 : Math.min(currentPage * pageSize, totalCount);

  const goToPreviousPage = () => {
    if (serverPagination) {
      onPageChange?.(Math.max(1, currentPage - 1));
      return;
    }

    setLocalPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    if (serverPagination) {
      onPageChange?.(Math.min(totalPages, currentPage + 1));
      return;
    }

    setLocalPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <section className="glass-card rounded-xl p-4 shadow-md">
      <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <div className="scroll-thin max-h-[34rem] overflow-auto">
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
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="border-b border-slate-100 dark:border-slate-800">
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column.key}`} className="px-3 py-2 text-slate-700 dark:text-slate-200">
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-3 py-4 text-center text-slate-500 dark:text-slate-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <p>
          Showing {startRow}-{endRow} of {totalCount}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Previous page"
          >
            ←
          </button>
          <span className="text-xs font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
