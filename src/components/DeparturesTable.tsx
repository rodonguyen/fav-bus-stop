import React from 'react';

import { BusDeparture, BusRoute } from '../types';

interface DeparturesTableProps {
  departures: BusDeparture[];
  findRouteDetails: (routeId: string) => BusRoute | undefined;
}

/**
 * Get the delay status of a departure
 * @param scheduled - The scheduled departure time
 * @param expected - The expected departure time
 * @returns The delay status and the class name for the status
 */
const getDelayStatus = (scheduled: string, expected?: string): { status: string; className: string } => {
  if (!expected) return { status: 'Scheduled', className: 'text-base-content/60' };

  const scheduledTime = new Date(scheduled).getTime();
  const expectedTime = new Date(expected).getTime();
  const diffMinutes = Math.round((expectedTime - scheduledTime) / 60000);

  if (diffMinutes > 1) {
    return { status: `Late (${diffMinutes} min)`, className: 'text-error' };
  } else if (diffMinutes < -1) {
    return { status: `Early (${Math.abs(diffMinutes)} min)`, className: 'text-success' };
  } else {
    return { status: 'On time', className: 'text-info' };
  }
};

export const DeparturesTable: React.FC<DeparturesTableProps> = ({ departures, findRouteDetails }) => {
  if (departures.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-base-content/80">No upcoming buses at this stop</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Route</th>
            <th>Departing In</th>
            <th className="text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {departures.slice(0, 5).map((departure) => {
            const delayStatus = getDelayStatus(
              departure.scheduledDepartureUtc,
              departure.realtime?.expectedDepartureUtc
            );

            const displayExpectedDeparture = departure.realtime?.expectedDepartureUtc
              ? '(' +
                new Date(departure.realtime.expectedDepartureUtc).toLocaleTimeString('en-US', {
                  timeStyle: 'short',
                }) +
                ')'
              : '';

            return (
              <tr key={departure.id}>
                <td className="font-medium">{departure.headsign}</td>
                <td>
                  {departure.departureDescription} &nbsp;{displayExpectedDeparture}
                </td>
                <td className="text-right">
                  {departure.realtime?.isCancelled ? (
                    <span className="text-error font-medium">Cancelled</span>
                  ) : departure.realtime?.isSkipped ? (
                    <span className="text-warning font-medium">Skipped</span>
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
