import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import { Route, StopData, FavoriteStop } from './types';
import { DeparturesTable } from './components/DeparturesTable';
import { AddStopForm } from './components/AddStopForm';
import { AddButton } from './components/AddButton';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';

function Dashboard() {
  const [favoriteStops, setFavoriteStops] = useState<FavoriteStop[]>([]);
  const [stopData, setStopData] = useState<Record<string, StopData>>({});
  const [isAddingStop, setIsAddingStop] = useState<boolean>(false);
  const [stopUrl, setStopUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Get theme state from context
  const { isDarkTheme } = useTheme();

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
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-4">Your Favorite Bus Stops</h1>

        
        <div className="flex justify-between items-center mb-6">
          <ThemeToggle />
          <AddButton isAddingStop={isAddingStop} onClick={() => setIsAddingStop(!isAddingStop)} />
        </div>
        
        {isAddingStop && (
          <AddStopForm
            stopUrl={stopUrl}
            setStopUrl={setStopUrl}
            onAdd={addFavoriteStop}
            loading={loading}
          />
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
                      <button 
                        onClick={() => deleteFavoriteStop(stop.id)}
                        className="btn btn-sm btn-outline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="px-4">
                    {!stopData[stop.stop_id] ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="loading loading-spinner loading-md"></div>
                        <p className="ml-2 text-base-content/60">Loading bus schedules...</p>
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
    </div>
  );
}

export default Dashboard; 