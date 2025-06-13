import React from 'react';

export interface AddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isAddingStop: boolean;
  onClick: () => void;
  className?: string;
}

export const AddButton: React.FC<AddButtonProps> = ({ isAddingStop, onClick, className = '', ...props }) => {
  return (
    <div className={className}>
      <button onClick={onClick} className={`btn btn-circle ${isAddingStop ? 'btn-error' : 'btn-primary'}`} {...props}>
        {isAddingStop ? '×' : '+'}
      </button>
    </div>
  );
};
