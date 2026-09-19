import React from 'react';
import { EMOJIS } from '../utils/constants';

const EmojiPicker = ({ onSelect, selected }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border border-white/10 hover:border-purple-500/50 bg-dark-surface text-2xl transition"
      >
        {selected || '😀'}
      </button>

      {isOpen && (
        <>
          <div
            className="absolute inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-12 left-0 z-50 grid grid-cols-5 gap-2 p-3 bg-dark-card border border-white/20 rounded-lg shadow-lg">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onSelect(emoji);
                  setIsOpen(false);
                }}
                className="p-2 hover:bg-purple-600/20 rounded transition text-xl hover:scale-110 transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EmojiPicker;
