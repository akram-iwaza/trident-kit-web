import { useState, useEffect, useCallback } from "react";

interface FetchState<T> {
  data: T;
  isLoading: boolean;
  error: boolean;
}

const useFetchV2 = <T,>(eventName: any, isReady?: boolean) => {
  const RemoteSettings: any = "";
  const window: any = "";
  const [fetchedData, setFetchedData] = useState<FetchState<T>>({
    data: [] as unknown as T,
    isLoading: true,
    error: false,
  });

  const fetchData = useCallback(() => {
    setFetchedData({
      data: [] as unknown as T,
      isLoading: true,
      error: false,
    });

    const handleResponse = (event: any, res: T) => {
      setFetchedData({ data: res, isLoading: false, error: false });
    };

    const handleError = (error: Error) => {
      console.error(`Error fetching data for event ${eventName}:`, error);
      setFetchedData({
        data: [] as unknown as T,
        isLoading: false,
        error: true,
      });
    };

    const cleanUpListener: any = "";

    return () => {
      if (cleanUpListener) {
        cleanUpListener();
      }
    };
  }, [eventName]);

  useEffect(() => {
    // Initial fetch on mount
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Re-fetch when isReady changes to true
    if (isReady) {
      console.log("isReady : ", isReady);

      fetchData();
    }
  }, [isReady, fetchData]);

  const setGroups = (groups: T) => {
    setFetchedData((prevState) => ({
      ...prevState,
      data: groups,
      isLoading: false,
      error: false,
    }));
  };

  return { ...fetchedData, setGroups };
};

export default useFetchV2;
