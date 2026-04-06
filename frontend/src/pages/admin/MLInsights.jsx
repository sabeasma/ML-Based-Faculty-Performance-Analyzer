import { useEffect, useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';
import { getModelMetrics } from '../../services/api';

export default function MLInsights() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    getModelMetrics().then(setMetrics);
  }, []);

  return (
    <RolePageTemplate title="ML Insights" description="Model quality and predictive insights for governance and promotion decisions.">
      <SectionCard title="Model Metrics">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
          <p><span className="font-semibold">R2 Score:</span> {metrics?.r2 ?? '-'}</p>
          <p><span className="font-semibold">MAE:</span> {metrics?.mae ?? '-'}</p>
          <p><span className="font-semibold">Samples:</span> {metrics?.samples ?? '-'}</p>
        </div>
      </SectionCard>
      <SectionCard title="Predicted Insights">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Promotion eligibility is high for top quartile faculty.</li>
          <li>Medium-risk faculty require teaching engagement interventions.</li>
          <li>Research output strongly influences long-term trend stability.</li>
        </ul>
      </SectionCard>
    </RolePageTemplate>
  );
}
