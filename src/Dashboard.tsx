import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import { Route, StopData, FavoriteStop } from './types';
import { DeparturesTable } from './components/DeparturesTable';
import { AddStopForm } from './components/AddStopForm';
import { AddButton } from './components/AddButton';

function Dashboard() {
  const [favoriteStops, setFavoriteStops] = useState<FavoriteStop[]>([]);
  const [stopData, setStopData] = useState<Record<string, StopData>>({});
  const [isAddingStop, setIsAddingStop] = useState<boolean>(false);
  const [stopUrl, setStopUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavoriteStops = async () => {
      const { data, error } = await supabase.from('favorite_stops').select('*');
      if (error) {
        console.error('Error fetching favorite stops:', error);
      } else {
        setFavoriteStops(data || []);
      }
    };

    fetchFavoriteStops();
  }, []);

  useEffect(() => {
    const fetchStopData = async () => {
      const data: Record<string, StopData> = {};
      for (const stop of favoriteStops) {
        try {
          const response = await fetch(`/api/stop/timetable/${stop.stop_id}`);
          const stopData = await response.json();
          data[stop.stop_id] = stopData;
        } catch (error) {
          console.error(`Error fetching data for stop ${stop.stop_id}:`, error);
        }
      }
      setStopData(data);
    };

    if (favoriteStops.length > 0) {
      fetchStopData();
      const interval = setInterval(fetchStopData, 5000);
      return () => clearInterval(interval);
    }
  }, [favoriteStops]);

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
      const response = await fetch(`/api/stop/timetable/${stopId}`);
      const stopData = await response.json();
      
      if (!stopData || !stopData.name) {
        alert('Could not fetch stop information. Please try again.');
        setLoading(false);
        return;
      }
      
      // Get current user ID
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;
      
      if (!userId) {
        alert('You must be logged in to add favorites.');
        setLoading(false);
        return;
      }
      
      // Add to Supabase
      const { error } = await supabase.from('favorite_stops').insert([
        { 
          stop_id: stopId,
          name: stopData.name,
          user_id: userId
        }
      ]);
      
      if (error) {
        console.error('Error adding favorite stop:', error);
        alert('Failed to add stop to favorites.');
      } else {
        // Refresh favorites
        const { data: favorites } = await supabase.from('favorite_stops').select('*');
        setFavoriteStops(favorites || []);
        setStopUrl('');
        setIsAddingStop(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add stop to favorites.');
    }
    
    setLoading(false);
  };

  const deleteFavoriteStop = async (stopId: string) => {
    if (confirm('Are you sure you want to remove this stop from your favorites?')) {
      const { error } = await supabase
        .from('favorite_stops')
        .delete()
        .match({ id: stopId });
      
      if (error) {
        console.error('Error deleting stop:', error);
        alert('Failed to delete stop.');
      } else {
        setFavoriteStops(favoriteStops.filter(stop => stop.id !== stopId));
      }
    }
  };

  // Find the route details for a departure
  const findRouteDetails = (stopData: StopData, routeId: string): Route | undefined => {
    return stopData.routes.find(route => route.id === routeId);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Your Favorite Bus Stops</h1>
      
      <AddButton isAddingStop={isAddingStop} onClick={() => setIsAddingStop(!isAddingStop)} />
      
      {isAddingStop && (
        <AddStopForm
          stopUrl={stopUrl}
          setStopUrl={setStopUrl}
          onAdd={addFavoriteStop}
          loading={loading}
        />
      )}
      
      <ul className="space-y-4 list-none">
        {favoriteStops.length === 0 ? (
          <li className="p-4 bg-white rounded-lg shadow-md text-center">
            No favorite stops yet. Add your first stop with the + button.
          </li>
        ) : (
          favoriteStops.map((stop) => (
            <li key={stop.id} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-xl font-semibold">{stop.name}</h2>
                </div>
                <button 
                  onClick={() => deleteFavoriteStop(stop.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              {!stopData[stop.stop_id] ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading bus schedules...</p>
                </div>
              ) : (
                <DeparturesTable
                  departures={stopData[stop.stop_id].departures}
                  findRouteDetails={(routeId) => findRouteDetails(stopData[stop.stop_id], routeId)}
                />
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Dashboard; 