const MEASUREMENT_ID = import.meta.env.VITE_GA4_ID;

export function initGA4() {
  if (!MEASUREMENT_ID) return;

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // send_page_view desactivado: al ser una SPA, cada página se registra
  // manualmente con trackPageView() en cada cambio de ruta.
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageView(path) {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_path: path,
    page_location: `${window.location.origin}${path}`,
  });
}
