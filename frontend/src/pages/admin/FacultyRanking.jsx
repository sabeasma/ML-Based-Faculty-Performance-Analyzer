import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { getRankings } from '../../services/api';

export default function FacultyRanking() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getRankings().then((data) => {
      setRows(
        data.map((item) => ({
          id: item.faculty_id,
          rank: item.rank ?? item.ranking,
          name: item.faculty_name,
          department: item.department,
          experience: `${item.years_of_experience} yrs`,
          score: item.ml_score,
          trend: item.risk_level === 'low' ? 'Upward' : item.risk_level === 'medium' ? 'Stable' : 'Downward',
        }))
      );
    });
  }, []);

  return (
    <RolePageTemplate title="Faculty Ranking" description="Scrollable ranking board based on latest ML scores.">
      <DataTable
        title="Leaderboard"
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
