import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { getFacultyList } from '../../services/api';

export default function FacultyManagement() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getFacultyList().then((data) => {
      setRows(
        data.map((item) => ({
          id: item.faculty_id,
          name: item.full_name,
          department: item.department,
          email: item.email,
          experience: `${item.years_of_experience} yrs`,
          score: item.ml_score,
        }))
      );
    });
  }, []);

  return (
    <RolePageTemplate title="Faculty Management" description="Manage faculty records and monitor individual ML performance.">
      <DataTable
        title="Faculty Directory"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'department', label: 'Department' },
          { key: 'email', label: 'Email' },
          { key: 'experience', label: 'Experience' },
          { key: 'score', label: 'ML Score' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
