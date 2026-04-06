import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="glass-card rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </motion.div>
  );
}
