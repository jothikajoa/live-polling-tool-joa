import React from 'react';
import { calculatePercentage } from '../utils/helpers';
import { motion } from 'framer-motion';

const PollResults = ({ poll, userVote, onVote, isLoading = false }) => {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="space-y-4">
      {poll.options.map((option, index) => {
        const percentage = calculatePercentage(option.votes, totalVotes);
        const isVoted = userVote === index;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card cursor-pointer transition ${
              isVoted ? 'ring-2 ring-purple-500' : ''
            }`}
            onClick={() => !isVoted && onVote(index)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.emoji || '😀'}</span>
                <span className="font-medium text-white">{option.text}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-purple-400">
                  {percentage}%
                </p>
                <p className="text-sm text-gray-400">{option.votes} votes</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-dark-surface rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full"
              />
            </div>
          </motion.div>
        );
      })}

      {userVote === undefined && (
        <p className="text-center text-gray-400 text-sm mt-6">
          Click on an option to vote
        </p>
      )}
    </div>
  );
};

export default PollResults;
