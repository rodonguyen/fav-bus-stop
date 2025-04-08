import React from 'react';

interface AddButtonProps {
  isAddingStop: boolean;
  onClick: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ isAddingStop, onClick }) => {
  return (
    <div className="mb-6 flex justify-end">
      <button onClick={onClick} className={`btn btn-circle ${isAddingStop ? 'btn-error' : 'btn-primary'}`}>
        {isAddingStop ? '×' : '+'}
      </button>
    </div>
  );
};
