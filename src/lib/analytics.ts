import ReactGA from "react-ga4";

/**
 * Initialise Google Analytics 4 with the measurement ID from the Vite
 * environment. Set VITE_GA_MEASUREMENT_ID in your .env file.
 */
export const initGA = (): void => {
  const measurementId =
    (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ??
    "your GA measurement id";
  ReactGA.initialize(measurementId);
};

export const handlePageView = (pathname: string, title: string): void => {
  ReactGA.send({
    hitType: "pageview",
    page: pathname,
    title,
  });
};

export const handleLogEvent = (
  category = "",
  action = "",
  label = ""
): void => {
  if (category && action) {
    ReactGA.event({ category, action, label });
  }
};

export const logException = (
  description = "",
  fatal = false
): void => {
  if (description) {
    ReactGA.gtag("event", "exception", {
      description,
      fatal,
    });
  }
};
