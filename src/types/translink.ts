// Transit data type definitions

export interface Position {
  lat: number;
  lng: number;
}

export interface Route {
  regionName: string;
  id: string;
  name: string;
  headSign: string;
  direction: string;
}

export interface Realtime {
  expectedDepartureUtc: string;
  isExtra: boolean;
  isSkipped: boolean;
  isCancelled: boolean;
}

export interface Departure {
  id: string;
  routeId: string;
  headsign: string;
  direction: string;
  scheduledDepartureUtc: string;
  departureDescription: string;
  canBoardDebark: string;
  realtime?: Realtime;
}

export interface ServiceAlerts {
  at: string;
  current: any[];
  upcoming: any[];
}

export interface StopData {
  id: string;
  name: string;
  zone: string;
  position: Position;
  routes: Route[];
  departures: Departure[];
  serviceAlerts: ServiceAlerts;
} 