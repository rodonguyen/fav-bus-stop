import { BusTimetable } from '../types/translink/bus';

class TranslinkApi {
  private static instance: TranslinkApi;
  private baseUrl: string = '/api';

  private constructor() {}

  public static getInstance(): TranslinkApi {
    if (!TranslinkApi.instance) {
      TranslinkApi.instance = new TranslinkApi();
    }
    return TranslinkApi.instance;
  }

  private async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);

    if (!response.ok) {
      throw new Error(`TransLink API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetches the timetable for a specific bus stop
   * @param stopId - The ID of the bus stop
   * @returns Promise<StopTimetable> - The timetable data for the stop
   * @throws Error if the API request fails
   */
  public async getStopTimetable(stopId: string): Promise<BusTimetable> {
    try {
      return await this.get<BusTimetable>(`/stop/timetable/${stopId}`);
    } catch (error) {
      console.error(`Failed to fetch timetable for stop ${stopId}:`, error);
      throw error;
    }
  }
}

export const translinkApi = TranslinkApi.getInstance();
