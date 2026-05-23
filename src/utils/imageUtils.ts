/**
 * Validates if a URL is a valid remote image URL (http or https).
 * @param url - The URL to validate
 * @returns True if the URL is a valid http/https URL
 */
export const isValidImageUrl = (url: unknown): boolean => {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Returns a valid image URL or a fallback.
 * @param url - The image URL to validate
 * @param fallback - Optional fallback URL (defaults to null)
 * @returns The valid URL or fallback
 */
export const getValidImageUrl = (
  url: unknown,
  fallback: string | null = null,
): string | null => {
  return isValidImageUrl(url) ? (url as string) : fallback;
};

/**
 * Returns a usable logo URL, skipping broken demo Cloudinary assets.
 * The original project seed data stored logos on res.cloudinary.com/ahossain
 * which no longer exists; those URLs return 404 and must be replaced with the local fallback.
 */
export const getLogoUrl = (url: unknown, fallback: string): string => {
  if (!url || typeof url !== "string") return fallback;
  if (url.includes("cloudinary.com/ahossain")) return fallback;
  return url;
};
