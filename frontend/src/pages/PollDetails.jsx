import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Loader } from 'lucide-react';
import { pollAPI } from '../services/api';
import PollResults from '../components/PollResults';
import Toast from '../components/Toast';

const PollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = React.useState(null);
  const [userVote, setUserVote] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isVoting, setIsVoting] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      setIsLoading(true);
      const response = await pollAPI.getPollById(id);
      setPoll(response.data);
      // Check if user has already voted
      const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '{}');
      setUserVote(votedPolls[id] !== undefined ? votedPolls[id] : null);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load poll' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (optionIndex) => {
    if (userVote !== null) {
      setToast({ type: 'error', message: 'You have already voted' });
      return;
    }

    setIsVoting(true);
    try {
      const response = await pollAPI.vote(id, optionIndex);
      setPoll(response.data);
      setUserVote(optionIndex);

      // Store vote in localStorage
      const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '{}');
      votedPolls[id] = optionIndex;
      localStorage.setItem('votedPolls', JSON.stringify(votedPolls));

      setToast({ type: 'success', message: 'Vote recorded successfully!' });
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to record vote' });
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/poll/${id}`;
    navigator.clipboard.writeText(url);
    setToast({ type: 'success', message: 'Link copied to clipboard!' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-dark-surface p-4 md:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        Back
      </motion.button>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <Loader className="animate-spin text-purple-400" size={40} />
        </div>
      ) : !poll ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-16"
        >
          <p className="text-gray-400 text-lg">Poll not found</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="card mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {poll.question}
                </h1>
                {poll.description && (
                  <p className="text-gray-400 text-lg">{poll.description}</p>
                )}
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            <div className="flex gap-4 text-sm">
              <span className={`px-3 py-1 rounded-full ${
                poll.status === 'active'
                  ? 'bg-green-600/20 text-green-400'
                  : 'bg-gray-600/20 text-gray-400'
              }`}>
                {poll.status === 'active' ? 'Active' : 'Closed'}
              </span>
              <span className="text-gray-400">
                {poll.options.reduce((sum, opt) => sum + opt.votes, 0)} votes
              </span>
            </div>
          </div>

          {/* Results */}
          <div className="card">
            <PollResults
              poll={poll}
              userVote={userVote}
              onVote={handleVote}
              isLoading={isVoting}
            />

            {userVote !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-600/20 border border-green-500/50 rounded-lg text-green-400"
              >
                ✓ Your vote has been recorded
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PollDetails;
