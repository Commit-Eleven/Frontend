import { useEffect, useState } from 'react';
import { codingLanguages } from '../data/navigation.js';

export function readCodingLanguage() {
  const routeMatch = window.location.pathname.match(/^\/journeys\/(html|javascript|python|java)\/fundamentals(?:\/|$)/);
  const selectedCode = routeMatch?.[1] || localStorage.getItem('codegram-language');
  return codingLanguages.find((language) => language.code === selectedCode) || codingLanguages[0];
}

export function useCodingLanguage() {
  const [language, setLanguage] = useState(readCodingLanguage);

  useEffect(() => {
    const syncLanguage = () => setLanguage(readCodingLanguage());
    window.addEventListener('codegram-language-change', syncLanguage);
    window.addEventListener('storage', syncLanguage);
    return () => {
      window.removeEventListener('codegram-language-change', syncLanguage);
      window.removeEventListener('storage', syncLanguage);
    };
  }, []);

  return language;
}

export function selectCodingLanguage(language) {
  localStorage.setItem('codegram-language', language.code);
  const routeMatch = window.location.pathname.match(/^\/journeys\/(?:html|javascript|python|java)\/fundamentals(?:\/[^/]+)?$/);
  if (routeMatch) window.history.replaceState({}, '', `/journeys/${language.code}/fundamentals`);
  window.dispatchEvent(new Event('codegram-language-change'));
}
