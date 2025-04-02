import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';

// New interfaces to match the Translink API response
interface Position {
  lat: number;
  lng: number;
}

interface Route {
  regionName: string;
  id: string;
  name: string;
  headSign: string;
  direction: string;
}

interface Realtime {
  expectedDepartureUtc: string;
  isExtra: boolean;
  isSkipped: boolean;
  isCancelled: boolean;
}

interface Departure {
  id: string;
  routeId: string;
  headsign: string;
  direction: string;
  scheduledDepartureUtc: string;
  departureDescription: string;
  canBoardDebark: string;
  realtime?: Realtime;
}

interface ServiceAlerts {
  at: string;
  current: any[];
  upcoming: any[];
}

interface StopData {
  id: string;
  name: string;
  zone: string;
  position: Position;
  routes: Route[];
  departures: Departure[];
  serviceAlerts: ServiceAlerts;
}

interface FavoriteStop {
  id: string;
  name: string;
  stop_id: string;
  user_id: string;
}

// Helper function to calculate delay status
const getDelayStatus = (scheduled: string, expected?: string): { status: string; className: string } => {
  if (!expected) return { status: 'Scheduled', className: 'text-gray-600' };
  
  const scheduledTime = new Date(scheduled).getTime();
  const expectedTime = new Date(expected).getTime();
  const diffMinutes = Math.round((expectedTime - scheduledTime) / 60000);
  
  if (diffMinutes > 1) {
    return { status: `Late (${diffMinutes} min)`, className: 'text-red-600' };
  } else if (diffMinutes < -1) {
    return { status: `Early (${Math.abs(diffMinutes)} min)`, className: 'text-green-600' };
  } else {
    return { status: 'On time', className: 'text-blue-600' };
  }
};

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
      
      {/* Add Button */}
      <div className="mb-4 flex justify-end">
        <button 
          onClick={() => setIsAddingStop(!isAddingStop)}
          className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors"
        >
          {isAddingStop ? '×' : '+'}
        </button>
      </div>
      
      {/* Add Stop Form */}
      {isAddingStop && (
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
              onClick={addFavoriteStop}
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
      )}
      
      {/* Favorite Stops List */}
      <ul className="space-y-4">
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
                  <p className="text-sm text-gray-500">Stop ID: {stop.stop_id}</p>
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
              ) : stopData[stop.stop_id].departures.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No upcoming buses at this stop</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                        <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departing In</th>
                        <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stopData[stop.stop_id].departures.slice(0, 5).map((departure) => {
                        const route = findRouteDetails(stopData[stop.stop_id], departure.routeId);
                        const delayStatus = getDelayStatus(
                          departure.scheduledDepartureUtc, 
                          departure.realtime?.expectedDepartureUtc
                        );
                        
                        return (
                          <tr key={departure.id}>
                            <td className="py-2 text-sm">
                              <span className="font-medium">{departure.headsign}</span>
                              {route && (
                                <span className="block text-xs text-gray-500 truncate max-w-[200px]">
                                  {route.name}
                                </span>
                              )}
                            </td>
                            <td className="py-2 text-sm">
                              {departure.departureDescription}
                            </td>
                            <td className="py-2 text-sm">
                              {departure.realtime?.isCancelled ? (
                                <span className="text-red-700 font-medium">Cancelled</span>
                              ) : departure.realtime?.isSkipped ? (
                                <span className="text-orange-600 font-medium">Skipped</span>
                              ) : (
                                <span className={delayStatus.className}>{delayStatus.status}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Dashboard; 