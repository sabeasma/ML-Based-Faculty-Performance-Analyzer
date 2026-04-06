import { useEffect, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import DataTable from '../../components/common/DataTable';
import { getDepartmentFaculty } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DepartmentRankings() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getDepartmentFaculty(user?.departmentId || 1).then((data) => {
      setRows(
        data.map((item, idx) => ({
          id: item.faculty_id,
          rank: idx + 1,
          faculty: item.full_name,
          score: item.ml_score,
          trend: item.risk_level === 'low' ? 'Upward' : 'Stable',
        }))
      );
    });
  }, [user?.departmentId]);

  return (
    <RolePageTemplate title="Department Rankings" description="Ranking of faculty within your department by ML score.">
      <DataTable
        title="Department Leaderboard"
        columns={[
          { key: 'rank', label: 'Rank' },
          { key: 'faculty', label: 'Faculty' },
          { key: 'score', label: 'ML Score' },
          { key: 'trend', label: 'Trend' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
