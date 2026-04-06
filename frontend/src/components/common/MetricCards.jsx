import StatCard from '../StatCard';

export default function MetricCards({ items = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          delay={0.05 * (index + 1)}
        />
      ))}
    </div>
  );
}
