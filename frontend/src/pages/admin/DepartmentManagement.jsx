import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/common/DataTable';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import { getFacultyList } from '../../services/api';

export default function DepartmentManagement() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    getFacultyList().then(setFaculty);
  }, []);

  const rows = useMemo(() => {
    const grouped = faculty.reduce((acc, item) => {
      acc[item.department] = (acc[item.department] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([department, count]) => ({
      id: department,
      department,
      facultyCount: count,
      status: 'Active',
    }));
  }, [faculty]);

  return (
    <RolePageTemplate title="Department Management" description="Overview and monitor department-level staffing and analytics coverage.">
      <DataTable
        title="Department Summary"
        columns={[
          { key: 'department', label: 'Department' },
          { key: 'facultyCount', label: 'Faculty Count' },
          { key: 'status', label: 'Status' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
