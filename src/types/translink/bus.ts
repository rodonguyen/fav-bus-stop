import { Position, Realtime, ServiceAlerts } from './common';

export interface BusRoute {
  id: string;
  name: string;
  number: string;
  operator: string;
}

export interface BusDeparture {
  id: string;
  headsign: string;
  scheduledDepartureUtc: string;
  departureDescription: string;
  realtime?: Realtime;
}

export interface BusTimetable {
  id: string; // Stop ID
  name: string; // Stop Name
  zone: string;
  position: Position;
  routes: BusRoute[];
  departures: BusDeparture[];
  serviceAlerts: ServiceAlerts;
}
