import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { getDepartmentFaculty } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DepartmentFaculty() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getDepartmentFaculty(user?.departmentId || 1).then(setRows);
  }, [user?.departmentId]);

  return (
    <RolePageTemplate title="Faculty List" description="Department-filtered faculty analytics list for HOD review.">
      <DataTable
        title="Department Faculty"
        columns={[
          { key: 'full_name', label: 'Faculty Name' },
          { key: 'email', label: 'Email' },
          { key: 'years_of_experience', label: 'Experience' },
          { key: 'ml_score', label: 'ML Score' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
