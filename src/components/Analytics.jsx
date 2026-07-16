import { useEffect } from 'react';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

function loadGtagScript(id) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-ga-id="${id}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.dataset.gaId = id;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Analytics script'));
    document.head.appendChild(script);
  });
}

export default function Analytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return undefined;

    let active = true;

    const init = async () => {
      try {
        await loadGtagScript(GA_MEASUREMENT_ID);
        if (!active) return;

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function gtag(...args) {
          window.dataLayer.push(args);
        };
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID, {
          anonymize_ip: true,
          send_page_view: true,
        });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Google Analytics failed to initialize:', error);
        }
      }
    };

    init();

    return () => {
      active = false;
    };
  }, []);

  return null;
}
