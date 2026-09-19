import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Real-time polling with instant results',
    },
    {
      icon: Users,
      title: 'Engage Users',
      description: 'Create interactive polls to engage your audience',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Beautiful visualizations of poll results',
    },
    {
      icon: CheckCircle,
      title: 'Easy to Use',
      description: 'Simple interface for creating and voting',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Live Polling</span>
            <br />
            <span className="text-white">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Create beautiful, interactive polls and get real-time results.
            Perfect for engagement, feedback, and insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary group">
                Go to Dashboard
                <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition" size={20} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary group">
                  Get Started
                  <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition" size={20} />
                </Link>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Animated Illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="card group cursor-pointer"
            >
              <div className="text-4xl mb-4">
                {i === 0 ? '🎯' : i === 1 ? '📊' : '🚀'}
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-purple-300 transition">
                {i === 0 ? 'Quick & Easy' : i === 1 ? 'Real-time Results' : 'Share Anywhere'}
              </h3>
              <p className="text-gray-400 text-sm">
                {i === 0
                  ? 'Create polls in seconds'
                  : i === 1
                  ? 'See results as they come in'
                  : 'Share with anyone, anywhere'}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center group hover:shadow-glow"
            >
              <div className="p-4 bg-purple-600/20 rounded-lg inline-block mb-4 group-hover:bg-purple-600/40 transition">
                <feature.icon className="text-purple-400" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="card bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to start polling?</h2>
          <p className="text-gray-300 mb-8">
            Create your first poll today and engage your audience instantly.
          </p>
          {!isAuthenticated && (
            <Link to="/signup" className="btn-primary inline-block">
              Create Account
            </Link>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
