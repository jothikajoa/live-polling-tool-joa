import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Eye, Share2 } from 'lucide-react';
import { pollAPI } from '../services/api';
import PollCard from '../components/PollCard';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import Sidebar from '../components/Sidebar';

const MyPolls = () => {
  const [polls, setPolls] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [toast, setToast] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchMyPolls();
  }, []);

  const fetchMyPolls = async () => {
    try {
      setIsLoading(true);
      const response = await pollAPI.getUserPolls();
      setPolls(response.data);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load your polls' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    setIsDeleting(true);
    try {
      await pollAPI.deletePoll(deleteModal);
      setPolls(polls.filter(p => p.id !== deleteModal));
      setToast({ type: 'success', message: 'Poll deleted successfully!' });
      setDeleteModal(null);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to delete poll' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = (pollId) => {
    const url = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(url);
    setToast({ type: 'success', message: 'Link copied to clipboard!' });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {deleteModal && (
          <ConfirmModal
            title="Delete Poll?"
            message="This action cannot be undone. All votes and data will be permanently deleted."
            type="danger"
            onConfirm={handleDelete}
            onCancel={() => setDeleteModal(null)}
            isLoading={isDeleting}
          />
        )}

        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">My Polls</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Manage all your polls in one place
          </p>

          {isLoading ? (
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card shimmer h-40" />
              ))}
            </div>
          ) : polls.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card text-center py-16"
            >
              <p className="text-gray-400 text-lg mb-4">
                You haven't created any polls yet
              </p>
              <button
                onClick={() => navigate('/create')}
                className="btn-primary inline-block"
              >
                Create Your First Poll
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {polls.map((poll, index) => (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PollCard
                    poll={poll}
                    onView={(id) => navigate(`/poll/${id}`)}
                    onDelete={(id) => setDeleteModal(id)}
                    onShare={handleShare}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPolls;
