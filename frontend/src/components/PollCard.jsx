import React from 'react';
import { Trash2, Eye, Share2 } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const PollCard = ({ poll, onView, onDelete, onShare, isLoading = false }) => {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="card group hover:shadow-glow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg truncate group-hover:text-purple-300 transition">
            {poll.question}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {poll.options.length} options • {totalVotes} votes
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          poll.status === 'active'
            ? 'bg-green-600/20 text-green-400'
            : 'bg-gray-600/20 text-gray-400'
        }`}>
          {poll.status === 'active' ? 'Active' : 'Closed'}
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Created {formatDate(poll.createdAt || poll.created_at)}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onView(poll.id)}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400 hover:text-purple-300 transition disabled:opacity-50"
        >
          <Eye size={18} />
          <span>View</span>
        </button>
        <button
          onClick={() => onShare(poll.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 hover:text-blue-300 transition"
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
        <button
          onClick={() => onDelete(poll.id)}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 hover:text-red-300 transition disabled:opacity-50"
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default PollCard;
