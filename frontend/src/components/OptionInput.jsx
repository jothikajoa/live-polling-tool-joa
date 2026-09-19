import React from 'react';
import { X } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

const OptionInput = ({ option, index, onChangeText, onChangeEmoji, onDelete }) => {
  return (
    <div className="flex gap-3 items-end">
      <EmojiPicker
        selected={option.emoji}
        onSelect={(emoji) => onChangeEmoji(index, emoji)}
      />
      <input
        type="text"
        value={option.text}
        onChange={(e) => onChangeText(index, e.target.value)}
        placeholder={`Option ${index + 1}`}
        className="input-field flex-1"
      />
      {index > 1 && (
        <button
          onClick={() => onDelete(index)}
          className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 transition"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default OptionInput;
