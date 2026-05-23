import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Augment window to include fbq
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

interface FacebookPixelProps {
  pixelId?: string;
  enabled?: boolean;
}

/**
 * Facebook Pixel Integration Component
 * Injects the FB Pixel base code and tracks page views on route changes.
 * Only renders when fb_pixel_status is enabled and fb_pixel_key is provided.
 */
const FacebookPixel = ({ pixelId, enabled }: FacebookPixelProps) => {
  const location = useLocation();

  useEffect(() => {
    if (!enabled || !pixelId) return;

    // Inject pixel script on first mount if not already present
    if (typeof window !== "undefined" && !window.fbq) {
      const script = document.createElement("script");
      script.id = "fb-pixel-base";
      script.async = true;
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }, [pixelId, enabled]);

  useEffect(() => {
    if (!enabled || !pixelId) return;

    // Track page view on route change
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location.pathname, enabled, pixelId]);

  if (!enabled || !pixelId) return null;

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
};

export default FacebookPixel;

/**
 * Helper to track custom FB Pixel events from anywhere in the app.
 * Usage: trackFBEvent("Purchase", { value: 49.99, currency: "USD" });
 */
export const trackFBEvent = (eventName: string, options: Record<string, unknown> = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, options);
  }
};

/**
 * Helper to track custom FB Pixel events (non-standard).
 * Usage: trackFBCustomEvent("SubscribeNewsletter", { email: "..." });
 */
export const trackFBCustomEvent = (eventName: string, options: Record<string, unknown> = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, options);
  }
};
