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
    <div className="card bg-base-200 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">Add Favorite Stop</h2>
        <div className="form-control w-full">
          <input
            type="text"
            value={stopUrl}
            onChange={(e) => setStopUrl(e.target.value)}
            placeholder="Enter Translink stop URL"
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text-alt">Example: https://jp.translink.com.au/plan-your-journey/stops/002023</span>
          </label>
        </div>
        <div className="card-actions justify-end mt-2">
          <button
            onClick={onAdd}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}; 