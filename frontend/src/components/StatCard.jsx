import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, trend, color = 'purple' }) => {
  const colorClasses = {
    purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/20',
    cyan: 'from-cyan-600/20 to-cyan-900/20 border-cyan-500/20',
    green: 'from-green-600/20 to-green-900/20 border-green-500/20',
    blue: 'from-blue-600/20 to-blue-900/20 border-blue-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`card bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-dark-card rounded-lg">
          <Icon className="text-cyan-400" size={24} />
        </div>
        {trend && (
          <div className={`text-sm font-semibold ${
            trend > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold gradient-text">{value}</p>
    </motion.div>
  );
};

export default StatCard;
