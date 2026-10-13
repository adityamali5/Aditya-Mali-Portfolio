import { PortfolioData } from '../types/portfolio';

const STORAGE_KEY = 'aditya_portfolio_cms_v1';

/**
 * Fetch portfolio data from the local backend API (disk storage)
 */
export async function fetchPortfolioFromBackend(): Promise<PortfolioData | null> {
  try {
    const res = await fetch('/api/portfolio', {
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.hero && json.certifications) {
        return json as PortfolioData;
      }
    }
  } catch (err) {
    console.warn('Backend API not reachable, falling back to local storage cache:', err);
  }

  // Fallback to localStorage cache
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }

  return null;
}

/**
 * Save complete portfolio data to the local backend API (persists to data/portfolio.json)
 */
export async function savePortfolioToBackend(data: PortfolioData): Promise<boolean> {
  // Always update localStorage cache immediately
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Local storage cache update error:', err);
  }

  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data, null, 2),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save portfolio to local backend API:', err);
    return false;
  }
}

/**
 * Upload an image (base64 data URL) to the backend API.
 * The backend permanently writes the file into public/uploads/<folder>/ on disk,
 * and returns the static URL (e.g. /uploads/certificates/cert_123.jpg).
 */
export async function uploadImageToBackend(
  base64DataUrl: string,
  fileName: string,
  folder: 'certificates' | 'photos' = 'certificates'
): Promise<string> {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64DataUrl,
        filename: fileName,
        folder,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
    throw new Error('Upload API returned non-OK status');
  } catch (err) {
    console.error('Failed to upload image to disk, falling back to base64 data URL:', err);
    // Graceful fallback to data URL if backend is offline
    return base64DataUrl;
  }
}
