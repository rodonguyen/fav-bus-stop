export interface Position {
  lat: number;
  lng: number;
}

export interface Realtime {
  expectedDepartureUtc: string;
  isExtra: boolean;
  isSkipped: boolean;
  isCancelled: boolean;
}

export interface ServiceAlertInfo {
  id: number;
  title: string;
  url: string;
  severity: string;
  cause: string;
  effect: string;
  startsUtc: string;
}

export interface ServiceAlerts {
  at: string;
  current: ServiceAlertInfo[];
  upcoming: ServiceAlertInfo[];
}
