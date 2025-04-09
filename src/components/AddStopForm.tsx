import React from 'react';

interface AddStopFormProps {
  stopUrl: string;
  setStopUrl: (url: string) => void;
  onAdd: () => void;
  loading: boolean;
  className?: string;
}

export const AddStopForm: React.FC<AddStopFormProps> = ({ stopUrl, setStopUrl, onAdd, loading, className }) => {
  return (
    <div className={`card bg-base-adaptive-100 shadow-xl mb-6 ${className}`}>
      <div className="card-body">
        <h2 className="card-title">Add Favorite Stop</h2>
        <p className="text-sm mb-2">
          Instructions: Go to{' '}
          <a
            href="https://jp.translink.com.au/plan-your-journey/stops"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            jp.translink.com.au/plan-your-journey/stops
          </a>{' '}
          to find your stop, copy and paste the URL address to the box below
        </p>
        <div className="form-control w-full">
          <input
            type="text"
            value={stopUrl}
            onChange={(e) => setStopUrl(e.target.value)}
            placeholder="Paste URL here"
            className="input input-bordered w-full my-2"
          />
          <p className="text-base-content/80">Example: https://jp.translink.com.au/plan-your-journey/stops/002023</p>
        </div>
        <div className="card-actions justify-end mt-2">
          <button onClick={onAdd} disabled={loading} className="btn btn-primary">
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};
