import supabase from '../supabase/supabaseClient';
import { FavoriteStop } from '../types';

class SupabaseApi {
  private static instance: SupabaseApi;

  private constructor() {}

  public static getInstance(): SupabaseApi {
    if (!SupabaseApi.instance) {
      SupabaseApi.instance = new SupabaseApi();
    }
    return SupabaseApi.instance;
  }

  /**
   * Fetches all favorite stops for the current user
   * @returns Promise<FavoriteStop[]> - Array of favorite stops
   * @throws Error if the database query fails
   */
  public async getFavoriteStops(): Promise<FavoriteStop[]> {
    const { data, error } = await supabase.from('favorite_stops').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorite stops:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Adds a new favorite stop for the current user
   * @param stopId - The ID of the stop to add
   * @param name - The name of the stop
   * @returns Promise<FavoriteStop> - The newly created favorite stop
   * @throws Error if the user is not logged in or if the database operation fails
   */
  public async addFavoriteStop(stopId: string, name: string): Promise<FavoriteStop> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      throw new Error('User must be logged in to add favorites');
    }

    const { data, error } = await supabase
      .from('favorite_stops')
      .insert([
        {
          stop_id: stopId,
          name,
          user_id: session.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding favorite stop:', error);
      throw error;
    }

    return data;
  }

  /**
   * Deletes a favorite stop
   * @param stopId - The ID of the favorite stop record to delete
   * @throws Error if the database operation fails
   */
  public async deleteFavoriteStop(stopId: string): Promise<void> {
    const { error } = await supabase.from('favorite_stops').delete().match({ id: stopId });

    if (error) {
      console.error('Error deleting favorite stop:', error);
      throw error;
    }
  }
}

export const supabaseApi = SupabaseApi.getInstance();
