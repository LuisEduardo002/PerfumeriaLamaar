import { useEffect } from 'react';

const SITE_NAME = 'LAMMAR';

function setMetaTag(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export default function useSEO({ title, description }) {
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
  }, [title, description]);
}
