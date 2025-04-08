import React, { useEffect, useState } from 'react';

import { supabaseApi } from '../api/supabaseApi';
import { translinkApi } from '../api/translinkApi';
import { AddButton } from '../components/AddButton';
import { AddStopForm } from '../components/AddStopForm';
import { DeparturesTable } from '../components/DeparturesTable';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import useRefreshTimer from '../hooks/useRefreshTimer';
import { FavoriteStop, Route, StopTimetable } from '../types';

const Dashboard: React.FC = () => {
  const [favoriteStops, setFavoriteStops] = useState<FavoriteStop[]>([]);
  const [stopData, setStopData] = useState<Record<string, StopTimetable>>({});
  const [isAddingStop, setIsAddingStop] = useState<boolean>(false);
  const [stopUrl, setStopUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { progress } = useRefreshTimer({
    onComplete: async () => {
      await fetchStopData();
    },
  });

  const fetchStopData = async (stopsToFetch?: FavoriteStop[]) => {
    const data: Record<string, StopTimetable> = {};
    // Use passed stops or fall back to state if not provided
    const stops = stopsToFetch || favoriteStops;

    for (const stop of stops) {
      try {
        const stopTimetable = await translinkApi.getStopTimetable(stop.stop_id);
        data[stop.stop_id] = stopTimetable;
      } catch (error) {
        console.error(`Error fetching data for stop ${stop.stop_id}:`, error);
      }
    }
    setStopData(data);
  };

  // Get theme state from context
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    const fetchFavoriteStops = async () => {
      const stops = await supabaseApi.getFavoriteStops();
      setFavoriteStops(stops);

      // Fetch stop data immediately after getting favorite stops
      if (stops.length > 0) {
        await fetchStopData(stops);
      }
    };

    fetchFavoriteStops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extractStopId = (url: string): string | null => {
    // Extract stop ID from URLs like https://jp.translink.com.au/plan-your-journey/stops/002023
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
      // Fetch stop data from the API
      const stopTimetable = await translinkApi.getStopTimetable(stopId);

      if (!stopTimetable || !stopTimetable.name) {
        alert('Could not fetch stop information. Please try again.');
        setLoading(false);
        return;
      }

      // Add to favorites using supabaseApi
      await supabaseApi.addFavoriteStop(stopId, stopTimetable.name);

      // Refresh favorites
      const favorites = await supabaseApi.getFavoriteStops();
      setFavoriteStops(favorites);
      setStopUrl('');
      setIsAddingStop(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add stop to favorites.');
    }

    setLoading(false);
  };

  const deleteFavoriteStop = async (stopId: string) => {
    if (confirm('Are you sure you want to remove this stop from your favorites?')) {
      try {
        await supabaseApi.deleteFavoriteStop(stopId);
        setFavoriteStops(favoriteStops.filter((stop) => stop.id !== stopId));
      } catch (error) {
        console.error('Error deleting stop:', error);
        alert('Failed to delete stop.');
      }
    }
  };

  // Find the route details for a departure
  const findRouteDetails = (stopData: StopTimetable, routeId: string): Route | undefined => {
    return stopData.routes.find((route) => route.id === routeId);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mt-4 mb-8">Your Favorite Stops</h1>

      <div className="flex justify-between items-center mb-2">
        <ThemeToggle />
        <div className="flex items-center gap-3">
          <div
            className="radial-progress text-primary"
            style={{ '--value': progress, '--size': '2.4rem', '--thickness': '0.6rem' } as React.CSSProperties}
            role="progressbar"
          ></div>
          <AddButton className="my-auto" isAddingStop={isAddingStop} onClick={() => setIsAddingStop(!isAddingStop)} />
        </div>
      </div>

      {isAddingStop && (
        <AddStopForm stopUrl={stopUrl} setStopUrl={setStopUrl} onAdd={addFavoriteStop} loading={loading} />
      )}

      <ul className="list-none space-y-6">
        {favoriteStops.length === 0 ? (
          <li className={`card p-2 ${isDarkTheme ? 'bg-base-300' : 'bg-base-100'} shadow-xl`}>
            <div className="card-body items-center text-center">
              <p>No favorite stops yet. Add your first stop with the + button.</p>
            </div>
          </li>
        ) : (
          favoriteStops.map((stop) => (
            <li key={stop.id} className={`card p-2 ${isDarkTheme ? 'bg-base-300' : 'bg-base-100'} shadow-xl`}>
              <div className="card-body p-0">
                <div className="flex justify-between items-center p-4 border-b space-x-4">
                  <h2 className="card-title">{stop.name}</h2>
                  <div className="card-actions">
                    <button onClick={() => deleteFavoriteStop(stop.id)} className="btn btn-sm btn-outline">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="px-4">
                  {!stopData[stop.stop_id] ? (
                    <div className="flex justify-center items-center py-4 mx-auto">
                      <span className="loading loading-spinner loading-md"></span>
                      <span className="ml-2 text-base-content/60">Loading bus schedules...</span>
                    </div>
                  ) : (
                    <DeparturesTable
                      departures={stopData[stop.stop_id].departures}
                      findRouteDetails={(routeId) => findRouteDetails(stopData[stop.stop_id], routeId)}
                    />
                  )}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
