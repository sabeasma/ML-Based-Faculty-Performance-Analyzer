import { motion } from 'framer-motion';

export default function Leaderboard({ data }) {
  const medal = ['🥇', '🥈', '🥉'];

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Faculty Ranking Leaderboard</h3>
      <div className="scroll-thin max-h-72 space-y-3 overflow-y-auto pr-2">
        {data.map((item, idx) => (
          <motion.div
            key={item.faculty_id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="flex items-center justify-between rounded-xl bg-white/65 px-4 py-3 dark:bg-slate-800/60"
          >
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {medal[idx] || `#${item.rank}`} {item.faculty_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.department} • {item.years_of_experience} yrs exp</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-300">{item.ml_score}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.risk_level} risk</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
