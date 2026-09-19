import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, BarChart3, Plus, FileText, LogOut, X, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Plus, label: 'Create Poll', path: '/create' },
    { icon: FileText, label: 'My Polls', path: '/my-polls' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-8 right-8 z-40 p-3 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative left-0 top-0 h-screen w-64 card transform transition-transform duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-bold gradient-text">Menu</h3>
        </div>

        <nav className="p-6 space-y-4 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-purple-600/20 transition group"
            >
              <item.icon
                size={20}
                className="text-gray-400 group-hover:text-purple-400 transition"
              />
              <span className="text-gray-300 group-hover:text-white transition">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-600/20 rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
