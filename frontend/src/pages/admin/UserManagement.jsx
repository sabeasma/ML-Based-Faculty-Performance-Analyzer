import { useEffect, useMemo, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import DataTable from '../../components/common/DataTable';
import { getFacultyList } from '../../services/api';

export default function UserManagement() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    getFacultyList().then(setFaculty);
  }, []);

  const rows = useMemo(
    () =>
      faculty.map((item) => ({
        id: item.faculty_id,
        name: item.full_name,
        email: item.email,
        role: 'faculty',
        status: 'active',
      })),
    [faculty]
  );

  return (
    <RolePageTemplate title="User Management" description="Manage user profiles, roles and active status across the platform.">
      <DataTable
        title="Users"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ]}
        rows={rows}
      />
    </RolePageTemplate>
  );
}
