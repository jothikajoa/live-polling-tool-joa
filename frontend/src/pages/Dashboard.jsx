import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { pollAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import PollCard from '../components/PollCard';
import Toast from '../components/Toast';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [polls, setPolls] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [toast, setToast] = React.useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      icon: BarChart3,
      title: 'Total Polls',
      value: polls.length,
      trend: 12,
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: 'Active Polls',
      value: polls.filter(p => p.status === 'active').length,
      trend: 8,
      color: 'cyan',
    },
    {
      icon: Users,
      title: 'Total Votes',
      value: polls.reduce(
        (sum, p) => sum + p.options.reduce((s, o) => s + o.votes, 0),
        0
      ),
      trend: 24,
      color: 'green',
    },
  ];

  React.useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setIsLoading(true);
      const response = await pollAPI.getAllPolls();
      setPolls(response.data);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load polls' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPoll = (pollId) => {
    navigate(`/poll/${pollId}`);
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

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-400">Here's what's happening with your polls</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/create')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Poll
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              color={stat.color}
            />
          ))}
        </div>

        {/* Recent Polls */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Polls</h2>
          {isLoading ? (
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card shimmer h-32" />
              ))}
            </div>
          ) : polls.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card text-center py-12"
            >
              <p className="text-gray-400 text-lg mb-4">No polls yet</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/create')}
                className="btn-primary inline-flex gap-2"
              >
                <Plus size={20} />
                Create Your First Poll
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {polls.slice(0, 6).map((poll, index) => (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PollCard
                    poll={poll}
                    onView={handleViewPoll}
                    onDelete={() => {}}
                    onShare={() => {}}
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

export default Dashboard;
