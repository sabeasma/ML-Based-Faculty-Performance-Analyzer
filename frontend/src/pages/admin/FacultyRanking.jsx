import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { getRankingsPage } from '../../services/api';

export default function FacultyRanking() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    let active = true;

    getRankingsPage({ page, pageSize: 10 }).then((result) => {
      if (!active) {
        return;
      }

      setTotalRows(Number(result.pagination?.total || 0));
      setRows(
        (result.items || [])
          .map((item) => ({
            id: item.faculty_id,
            rank: Number(item.rank ?? item.ranking ?? 0),
            name: item.faculty_name,
            department: item.department,
            experience: `${item.years_of_experience} yrs`,
            score: item.ml_score,
            trend: item.risk_level === 'low' ? 'Upward' : item.risk_level === 'medium' ? 'Stable' : 'Downward',
          }))
          .sort((a, b) => a.rank - b.rank)
      );
    });

    return () => {
      active = false;
    };
  }, [page]);

  return (
    <RolePageTemplate title="Faculty Ranking" description="Scrollable ranking board based on latest ML scores.">
      <DataTable
        title="Leaderboard"
        serverPagination
        page={page}
        pageSize={10}
        totalRows={totalRows}
        onPageChange={setPage}
        columns={[
          { key: 'rank', label: 'Rank' },
          { key: 'name', label: 'Faculty Name' },
          { key: 'department', label: 'Department' },
          { key: 'experience', label: 'Experience' },
          { key: 'score', label: 'ML Score' },
          { key: 'trend', label: 'Trend' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
