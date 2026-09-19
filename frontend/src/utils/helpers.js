export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString('en-US', options);
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const getTotalVotes = (options) => {
  return options.reduce((sum, option) => sum + option.votes, 0);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePoll = (poll) => {
  if (!poll.question || poll.question.trim().length === 0) {
    return { valid: false, error: 'Poll question is required' };
  }
  if (poll.options.length < 2) {
    return { valid: false, error: 'Poll must have at least 2 options' };
  }
  if (poll.options.some(opt => opt.text.trim().length === 0)) {
    return { valid: false, error: 'All options must have text' };
  }
  return { valid: true };
};
