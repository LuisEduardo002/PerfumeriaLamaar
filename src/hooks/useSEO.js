import { useEffect } from 'react';

const SITE_NAME = 'LAMMAR';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://lamaarperfum.store').replace(/\/+$/, '');

function setMetaTag(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLinkTag(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export default function useSEO({ title, description, canonical }) {
  useEffect(() => {
    if (title) {
      const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
      document.title = fullTitle;
      setMetaTag('property', 'og:title', fullTitle);
      setMetaTag('name', 'twitter:title', fullTitle);
    }

    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    if (canonical) {
      const href = `${SITE_URL}${canonical}`;
      setLinkTag('canonical', href);
      setMetaTag('property', 'og:url', href);
    }
  }, [title, description, canonical]);
}
