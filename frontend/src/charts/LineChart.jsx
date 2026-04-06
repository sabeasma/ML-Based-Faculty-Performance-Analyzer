import {
  Line,
  LineChart as ReLineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function LineChart({ data, xKey, yKey, color = '#2563eb' }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={3} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
