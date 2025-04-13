// Favorite stops type definitions

export type TransportType = 'bus' | 'train_station' | 'train_platform' | 'ferry_terminal';

export interface FavoriteStop {
  id: string;
  user_id: string;
  name: string; // Display name
  stop_id: string; // The primary ID (stop, platform, station, terminal)
  transport_type: TransportType;
  created_at?: string;
}

export interface FavoriteStopInput {
  transport_type: TransportType;
  name: string;
  stop_id: string;
}
