import React, { useState } from 'react';

import { supabaseApi } from '../api/supabaseApi';
import { translinkApi } from '../api/translinkApi';
import AdaptiveStyles from '../styles/adaptiveStyles';

interface AddStopFormProps {
  onAddSuccess: () => void;
  className?: string;
}

export const AddStopForm: React.FC<AddStopFormProps> = ({ onAddSuccess, className }) => {
  const [stopUrl, setStopUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const adaptiveStyles = AdaptiveStyles();

  const extractStopId = (url: string): string | null => {
    const regex = /stops\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const addFavoriteStop = async () => {
    setLoading(true);

    const stopId = extractStopId(stopUrl);
    if (!stopId) {
      alert('Invalid URL. Please enter a valid Translink stop URL.');
      setLoading(false);
      return;
    }

    try {
      const stopTimetable = await translinkApi.getStopTimetable(stopId);

      if (!stopTimetable || !stopTimetable.name) {
        alert('Could not fetch stop information. Please try again.');
        setLoading(false);
        return;
      }

      await supabaseApi.addFavoriteStop(stopId, stopTimetable.name);

      onAddSuccess();
      setStopUrl('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add stop to favorites.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card ${adaptiveStyles['bg-base-adaptive-100']} shadow-xl mb-6 ${className}`}>
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
          <button onClick={addFavoriteStop} disabled={loading} className="btn btn-primary">
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};
