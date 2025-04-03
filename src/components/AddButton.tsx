import React from 'react';

interface AddButtonProps {
  isAddingStop: boolean;
  onClick: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ isAddingStop, onClick }) => {
  return (
    <div className="mb-4 flex justify-end">
      <button 
        onClick={onClick}
        className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors"
      >
        {isAddingStop ? '×' : '+'}
      </button>
    </div>
  );
}; 