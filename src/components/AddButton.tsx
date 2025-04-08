import React from 'react';

interface AddButtonProps {
  isAddingStop: boolean;
  onClick: () => void;
  className?: string;
}

export const AddButton: React.FC<AddButtonProps> = ({ isAddingStop, onClick, className = '' }) => {
  return (
    <div className={className}>
      <button onClick={onClick} className={`btn btn-circle ${isAddingStop ? 'btn-error' : 'btn-primary'}`}>
        {isAddingStop ? '×' : '+'}
      </button>
    </div>
  );
};
