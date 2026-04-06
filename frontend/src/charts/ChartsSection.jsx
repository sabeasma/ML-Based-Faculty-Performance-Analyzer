import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';

const lineData = [
  { semester: '2024-O', score: 72 },
  { semester: '2024-E', score: 78 },
  { semester: '2025-O', score: 84 },
  { semester: '2025-E', score: 88 },
];

const barData = [
  { subject: 'DSA', rating: 4.3 },
  { subject: 'DBMS', rating: 4.6 },
  { subject: 'AI', rating: 4.7 },
  { subject: 'CN', rating: 4.1 },
];

const pieData = [
  { name: 'Teaching', value: 45 },
  { name: 'Research', value: 35 },
  { name: 'Mentoring', value: 20 },
];

const radarData = [
  { skill: 'Knowledge', value: 88 },
  { skill: 'Interaction', value: 76 },
  { skill: 'Communication', value: 82 },
  { skill: 'Innovation', value: 79 },
  { skill: 'Research', value: 85 },
];

const colors = ['#2563eb', '#4f46e5', '#06b6d4'];

function ChartCard({ title, children }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
      <div className="h-64">{children}</div>
    </div>
  );
}

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <ChartCard title="Performance Trend Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
            <XAxis dataKey="semester" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Subject Rating Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
            <XAxis dataKey="subject" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="rating" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Contribution Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={88} dataKey="value" label>
              {pieData.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Skill Radar Analysis">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <Radar dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.45} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
