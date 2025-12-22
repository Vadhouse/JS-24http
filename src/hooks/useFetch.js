import axios from 'axios';
import { useEffect, useState } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.warn('something went wrong', error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading };
};
