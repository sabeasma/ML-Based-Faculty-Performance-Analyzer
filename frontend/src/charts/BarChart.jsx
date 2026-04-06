import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function BarChart({ data, xKey, yKey, color = '#0ea5e9' }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} fill={color} radius={[8, 8, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
