import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, Wand2 } from 'lucide-react';
import { pollAPI } from '../services/api';
import OptionInput from '../components/OptionInput';
import Toast from '../components/Toast';
import Sidebar from '../components/Sidebar';

const CreatePoll = () => {
  const [question, setQuestion] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [options, setOptions] = React.useState([
    { text: '', emoji: '😀' },
    { text: '', emoji: '🔥' },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const navigate = useNavigate();

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', emoji: '⭐' }]);
    }
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, text) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleEmojiChange = (index, emoji) => {
    const newOptions = [...options];
    newOptions[index].emoji = emoji;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!question.trim()) {
      setToast({ type: 'error', message: 'Question is required' });
      return;
    }
    if (options.length < 2) {
      setToast({ type: 'error', message: 'Poll must have at least 2 options' });
      return;
    }
    if (options.some(opt => !opt.text.trim())) {
      setToast({ type: 'error', message: 'All options must have text' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await pollAPI.createPoll({
        question,
        description,
        options: options.map(opt => ({ text: opt.text, emoji: opt.emoji })),
      });
      setToast({ type: 'success', message: 'Poll created successfully!' });
      setTimeout(() => navigate(`/poll/${response.data.id}`), 500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.error || 'Failed to create poll',
      });
    } finally {
      setIsLoading(false);
    }
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

        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Create a New Poll</span>
            </h1>
            <p className="text-gray-400 mb-8">
              Ask your audience anything and get instant feedback
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Question */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  Poll Question
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What's your favorite programming language?"
                  className="input-field text-lg"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {question.length}/200
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more context to your poll..."
                  className="input-field resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>

              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-300">
                    Poll Options
                  </label>
                  <span className="text-xs text-gray-500">
                    {options.length}/6
                  </span>
                </div>

                <div className="space-y-4">
                  {options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <OptionInput
                        option={option}
                        index={index}
                        onChangeText={handleOptionChange}
                        onChangeEmoji={handleEmojiChange}
                        onDelete={handleRemoveOption}
                      />
                    </motion.div>
                  ))}
                </div>

                {options.length < 6 && (
                  <motion.button
                    type="button"
                    onClick={handleAddOption}
                    whileHover={{ scale: 1.02 }}
                    className="mt-4 w-full py-3 border-2 border-dashed border-purple-500/50 hover:border-purple-500 rounded-lg text-purple-400 hover:text-purple-300 transition flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus size={20} />
                    Add Option
                  </motion.button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Wand2 size={20} />
                  {isLoading ? 'Creating...' : 'Create Poll'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
