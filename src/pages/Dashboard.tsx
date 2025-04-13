import React, { useEffect, useState } from 'react';

import { supabaseApi } from '../api/supabaseApi';
import { translinkApi } from '../api/translinkApi';
import { AddButton } from '../components/AddButton';
import { AddStopForm } from '../components/AddStopForm';
import { DeparturesTable } from '../components/DeparturesTable';
import ThemeToggle from '../components/ThemeToggle';
import useRefreshTimer from '../hooks/useRefreshTimer';
import AdaptiveStyles from '../styles/adaptiveStyles';
import { BusRoute, BusTimetable, FavoriteStop } from '../types';

const Dashboard: React.FC = () => {
  const [favoriteStops, setFavoriteStops] = useState<FavoriteStop[]>([]);
  const [stopData, setStopData] = useState<Record<string, BusTimetable>>({});
  const [isAddingStop, setIsAddingStop] = useState<boolean>(false);
  const { progress } = useRefreshTimer({
    onComplete: async () => {
      await fetchStopData();
    },
  });

  const adaptiveStyles = AdaptiveStyles();

  const fetchStopData = async (stopsToFetch?: FavoriteStop[]) => {
    const data: Record<string, BusTimetable> = {};
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
  }, []);

  // New handler for successful addition
  const handleAddStopSuccess = async () => {
    try {
      const favorites = await supabaseApi.getFavoriteStops();
      setFavoriteStops(favorites);
      setIsAddingStop(false);
    } catch (error) {
      console.error('Error refreshing favorites after add:', error);
      alert('Failed to refresh favorites list after adding stop.');
    }
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
  const findRouteDetails = (stopData: BusTimetable, routeId: string): BusRoute | undefined => {
    return stopData.routes.find((route) => route.id === routeId);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="relative">
        <h1 className="text-3xl font-bold text-center mt-4 mb-8">Your Favorite Stops</h1>
        <div className="absolute left-1/2 -translate-y-[-0.4rem] -translate-x-1/2 bottom-0 w-screen h-[1px] bg-gradient-to-r from-transparent via-base-content/20 to-transparent"></div>
      </div>

      <div className="flex justify-between items-center mb-4">
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

      <AddStopForm className={isAddingStop ? '' : 'hidden'} onAddSuccess={handleAddStopSuccess} />

      <ul className="list-none space-y-6">
        {favoriteStops.length === 0 ? (
          <li className={`card p-2 ${adaptiveStyles['bg-base-adaptive-100']} shadow-xl`}>
            <div className="card-body items-center text-center">
              <p>No favorite stops yet. Add your first stop with the + button.</p>
            </div>
          </li>
        ) : (
          favoriteStops.map((stop) => (
            <li key={stop.id} className={`card p-2 ${adaptiveStyles['bg-base-adaptive-100']} shadow-xl`}>
              <div className="card-body p-0">
                <div className="flex justify-between items-center p-4 border-b space-x-4">
                  <h2 className="card-title">{stop.name}</h2>
                  <div className="card-actions">
                    <button onClick={() => deleteFavoriteStop(stop.id)} className="btn btn-sm btn-outline">
                      Remove
                    </button>
                  </div>
                </div>

                <div>
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
