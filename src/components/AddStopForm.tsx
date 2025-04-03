import React from 'react';

interface AddStopFormProps {
  stopUrl: string;
  setStopUrl: (url: string) => void;
  onAdd: () => void;
  loading: boolean;
}

export const AddStopForm: React.FC<AddStopFormProps> = ({ 
  stopUrl, 
  setStopUrl, 
  onAdd, 
  loading 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-2">Add Favorite Stop</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={stopUrl}
          onChange={(e) => setStopUrl(e.target.value)}
          placeholder="Enter Translink stop URL"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={onAdd}
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Example: https://jp.translink.com.au/plan-your-journey/stops/002023
      </p>
    </div>
  );
}; 