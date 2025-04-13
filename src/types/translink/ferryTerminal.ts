import { Position, ServiceAlerts } from './common';
import { TrainDeparture, TrainRoute } from './trainStation';

// This is not used as reusing BusType is ok right

// Reusing train route/departure types as they match
export interface FerryTerminalTimetable {
  id: string; // Terminal/Stop ID
  name: string; // Terminal/Stop Name
  zone: string;
  position: Position;
  routes: TrainRoute[];
  departures: TrainDeparture[];
  serviceAlerts: ServiceAlerts;
}
