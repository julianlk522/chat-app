import { useEffect } from 'react';

export const useScript = (url, callback) => {
  useEffect(() => {
    let script = document.createElement('script');

    script.src = url;
    script.onload = callback;

    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, [url, callback]);
};
