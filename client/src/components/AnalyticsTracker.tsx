import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function AnalyticsTracker() {
  const location = useLocation();
  const { user } = useAuth();
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined' || !window.gtag) return;
    const pagePath = location.pathname + location.search;
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: document.title,
      page_location: window.location.href
    });
  }, [location, measurementId]);

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined' || !window.gtag || !user) return;
    window.gtag('event', 'login', {
      method: 'Firebase',
      user_id: user.id,
      user_role: user.role
    });
  }, [user, measurementId]);

  return null;
}
