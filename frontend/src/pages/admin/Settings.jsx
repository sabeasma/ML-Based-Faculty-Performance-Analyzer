import { useState } from 'react';
import RolePageTemplate from '../../components/common/RolePageTemplate';
import SectionCard from '../../components/common/SectionCard';

export default function Settings() {
  const [config, setConfig] = useState({
    alerts: true,
    weeklyReports: true,
    autoRetrain: false,
  });

  return (
    <RolePageTemplate title="Settings" description="Configure platform preferences, notifications and automation.">
      <SectionCard title="System Settings">
        <div className="space-y-3 text-sm">
          {[
            ['alerts', 'Enable notifications'],
            ['weeklyReports', 'Send weekly analytics reports'],
            ['autoRetrain', 'Auto retrain ML model'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={config[key]}
                onChange={() => setConfig((prev) => ({ ...prev, [key]: !prev[key] }))}
              />
            </label>
          ))}
        </div>
      </SectionCard>
    </RolePageTemplate>
  );
}
