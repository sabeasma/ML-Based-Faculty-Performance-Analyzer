import { Children, cloneElement, isValidElement } from 'react';
import DataTable from './DataTable';
import SectionCard from './SectionCard';

export default function RolePageTemplate({ title, description, children }) {
  const normalizedChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === DataTable) {
      return cloneElement(child, {
        pageSize: child.props.pageSize ?? 10,
      });
    }

    return child;
  });

  return (
    <div className="space-y-4">
      <SectionCard title={title}>
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </SectionCard>
      {normalizedChildren}
    </div>
  );
}
