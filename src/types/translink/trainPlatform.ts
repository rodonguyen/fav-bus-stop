import { Position, ServiceAlerts } from './common';
import { TrainDeparture, TrainRoute } from './trainStation';

// This is not used as reusing BusType is ok right

export interface TrainStationInfo {
  id: string; // Parent Station ID (e.g., "ST:place_sbasta")
  name: string;
  position: Position;
  serviceType: string;
}

export interface TrainPlatformTimetable {
  id: string; // Platform/Stop ID (e.g., "SI:600006")
  name: string; // Platform/Stop Name
  zone: string;
  position: Position; // Platform Position
  station: TrainStationInfo; // Info about the parent station
  routes: TrainRoute[];
  departures: TrainDeparture[];
  serviceAlerts: ServiceAlerts;
}
