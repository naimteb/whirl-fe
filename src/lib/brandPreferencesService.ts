// API configuration
import { apiBaseUrl } from "@/config/env";
const API_BASE_URL = `${apiBaseUrl}/api`;

export interface BrandPreferences {
  id?: number;
  user_id: string;
  age_range?: string;
  location?: string;
  product_description?: string;
  marketing_strategy?: string;
  budget_range?: string;
  tone_of_voice?: string[];
  company_culture?: string;
  past_ads?: string;
  sales_importance?: number;
  brand_awareness_importance?: number;
  customer_engagement_importance?: number;
  lead_generation_importance?: number;
  brand_recognition_importance?: number;
  has_social_media_presence?: boolean;
  targets_b2b?: boolean;
  has_seasonal_marketing?: boolean;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  additional_colors?: string;
  brand_inspiration?: string;
  additional_brand_info?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class BrandPreferencesService {
  // Save or update brand preferences
  static async savePreferences(preferences: BrandPreferences): Promise<BrandPreferences> {
    try {
      const response = await fetch(`${API_BASE_URL}/brand-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        const message = await response.text().catch(() => '');
        throw new Error(`Save failed (${response.status}): ${message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving brand preferences:', error);
      throw error;
    }
  }

  // Get preferences by user ID
  static async getPreferencesByUserId(userId: string): Promise<BrandPreferences | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/brand-preferences/${userId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const message = await response.text().catch(() => '');
        throw new Error(`Load failed (${response.status}): ${message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching brand preferences:', error);
      return null;
    }
  }

  // Delete preferences by user ID
  static async deletePreferences(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/brand-preferences/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting brand preferences:', error);
      return false;
    }
  }

  // Get all preferences for admin purposes
  static async getAllPreferences(): Promise<BrandPreferences[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/brand-preferences`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all brand preferences:', error);
      return [];
    }
  }
}
