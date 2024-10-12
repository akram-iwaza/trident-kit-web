import { useState, useEffect, useCallback, useRef } from "react";

interface FetchState<T> {
  data: T | [];
  isLoading: boolean;
  error: string | null;
}

interface UseFetchV3Options {
  retry?: boolean; // Optional retry flag, defaults to false if not provided
}

const useFetchV3 = <T,>(
  eventName: any,
  { retry = false }: UseFetchV3Options = {}
) => {
  const RemoteSettings: any = "";
  const window: any = "";
  const pako: any = "";
  const [fetchedData, setFetchedData] = useState<FetchState<T>>({
    data: [],
    isLoading: true,
    error: null,
  });

  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const fetchData = useCallback(() => {
    console.log("Fetching data...");

    setFetchedData((prevState) => ({
      ...prevState, // Retain previous data to prevent unnecessary resets
      isLoading: true,
      error: null,
    }));

    const handleResponse = (event: any, res: Uint8Array) => {
      try {
        const decompressedData = pako.ungzip(res, { to: "string" });
        const parsedData = JSON.parse(decompressedData);

        // Reset retry count on successful fetch
        retryCountRef.current = 0;

        setFetchedData({
          data: parsedData || [],
          isLoading: false,
          error: null,
        });

        // Clear retry timer if data is fetched successfully
        if (retryTimerRef.current) {
          clearInterval(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      } catch (error) {
        console.error(`Error decompressing or parsing data: ${error}`);
        setFetchedData({
          data: [],
          isLoading: false,
          error: `Error processing data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    };

    // Listen for IPC event response
    const cleanUpListener: any = "";

    return () => {
      if (cleanUpListener) {
        cleanUpListener();
      }
    };
  }, [eventName]);

  useEffect(() => {
    const cleanupListener = fetchData();

    if (retry) {
      const retryFetch = () => {
        const isDataEmptyArray =
          Array.isArray(fetchedData.data) && fetchedData.data.length === 0;
        if (isDataEmptyArray && retryCountRef.current < 5) {
          console.log("Retrying fetch...");
          retryCountRef.current += 1;
          fetchData();
        }
      };

      retryTimerRef.current = setInterval(retryFetch, 10000);
    }

    return () => {
      if (retryTimerRef.current) {
        clearInterval(retryTimerRef.current);
      }
      if (cleanupListener) {
        cleanupListener();
      }
    };
  }, [fetchData, retry]);

  const setGroups = (groups: T) => {
    setFetchedData({
      data: groups,
      isLoading: false,
      error: null,
    });
  };

  return { ...fetchedData, setGroups };
};

export default useFetchV3;
