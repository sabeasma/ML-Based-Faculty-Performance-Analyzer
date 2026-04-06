import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as ReRadarChart,
  ResponsiveContainer,
} from 'recharts';

export default function RadarChart({ data, keyName = 'skill', valueKey = 'value' }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <ReRadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={keyName} />
          <Radar dataKey={valueKey} stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
