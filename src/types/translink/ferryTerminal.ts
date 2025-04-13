import { Position, ServiceAlerts } from './common';
import { TrainDeparture, TrainRoute } from './trainStation';

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
