import { Position, Realtime, ServiceAlerts } from './common';

export interface TrainPlatformStop {
  id: string;
  name: string;
  zone: string;
  position: Position;
  serviceType: string;
}

export interface TrainLineInfo {
  id: string;
  regionId: string;
  name: string;
  vehicleType: string;
  textColorCode: string;
  hexColorCode: string;
}

export interface TrainRoute {
  regionName: string;
  id: string;
  name: string;
  headSign: string;
  direction: string;
  lines?: TrainLineInfo[];
}

export interface TrainDeparture {
  id: string;
  routeId: string;
  headsign: string;
  direction: string;
  scheduledDepartureUtc: string;
  departureDescription: string;
  canBoardDebark: string;
  realtime?: Realtime;
}

export interface TrainStationTimetable {
  id: string; // Station/Place ID
  name: string; // Station/Place Name
  position: Position;
  stops: TrainPlatformStop[]; // Platforms within the station
  routes: TrainRoute[];
  departures: TrainDeparture[];
  serviceAlerts: ServiceAlerts;
}
