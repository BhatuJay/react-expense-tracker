import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    fetch(url)
      .then((res) => res.json())
      .then((data) => {setData(data); setIsLoading(false)});
  }, [url]);

  return [data, loading];
};