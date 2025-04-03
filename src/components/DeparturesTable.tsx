import React from 'react';
import { Departure, Route } from '../types';

interface DeparturesTableProps {
  departures: Departure[];
  findRouteDetails: (routeId: string) => Route | undefined;
}

/**
 * Get the delay status of a departure
 * @param scheduled - The scheduled departure time
 * @param expected - The expected departure time
 * @returns The delay status and the class name for the status
 */
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

export const DeparturesTable: React.FC<DeparturesTableProps> = ({ departures, findRouteDetails }) => {
  if (departures.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No upcoming buses at this stop</p>
      </div>
    );
  }

  return (
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
          {departures.slice(0, 5).map((departure) => {
            const delayStatus = getDelayStatus(
              departure.scheduledDepartureUtc, 
              departure.realtime?.expectedDepartureUtc
            );
            
            return (
              <tr key={departure.id}>
                <td className="py-2 text-sm">
                  <span className="font-medium">{departure.headsign}</span>
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
  );
}; 