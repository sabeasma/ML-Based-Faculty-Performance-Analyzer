import {
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const palette = ['#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

export default function PieChart({ data, valueKey = 'value', nameKey = 'name' }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <RePieChart>
          <Pie data={data} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={86} label>
            {data.map((entry, index) => (
              <Cell key={entry[nameKey]} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}
