import { useState, useEffect, useCallback, useReducer } from "react";

interface FetchState<T> {
  data: T;
  isLoading: boolean;
  error: boolean;
  isPartialData: boolean;
}

type Action<T> =
  | { type: "FETCH_INIT" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_FAILURE"; error: string }
  | { type: "FETCH_PARTIAL_SUCCESS"; payload: T };

function fetchReducer<T>(
  state: FetchState<T>,
  action: Action<T>
): FetchState<T> {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        error: false,
        isPartialData: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: false,
      };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, error: true };
    case "FETCH_PARTIAL_SUCCESS":
      return {
        ...state,
        isLoading: true,
        data: action.payload,
        isPartialData: true,
      };
    default:
      throw new Error();
  }
}

const useFetch = <T,>(
  eventName: string,
  retryLimit: number = 4,
  retryInterval: number = 3000
) => {
  const RemoteSettings: any = "";
  const window: any = "";
  const [state, dispatch] = useReducer(fetchReducer, {
    data: [] as unknown as T,
    isLoading: true,
    error: false,
    isPartialData: false,
  });

  const [retryCount, setRetryCount] = useState(0);
  const CHUNK_SIZE = 1000; // Load 1000 tasks at a time

  const fetchData = useCallback(async () => {
    if (!RemoteSettings.appPath) {
      console.error("RemoteSettings.appPath is not defined");
      if (retryCount < retryLimit) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchData();
        }, retryInterval); // Retry after retryInterval milliseconds
      } else {
        dispatch({ type: "FETCH_FAILURE", error: "Invalid app path" });
      }
      return;
    }

    const filePath =
      RemoteSettings.appPath +
      `${window.path.pathSepration()}TaskConfigs${window.path.pathSepration()}${eventName}.json`;

    dispatch({ type: "FETCH_INIT" });

    try {
      const data: any = window.fs.readFileSync(filePath);
      const formattedData: any[] = JSON.parse(data);
      let loadedData: any[] = [];
      let chunkIndex = 0;

      while (chunkIndex * CHUNK_SIZE < formattedData.length) {
        const chunk = formattedData.slice(
          chunkIndex * CHUNK_SIZE,
          (chunkIndex + 1) * CHUNK_SIZE
        );
        loadedData = loadedData.concat(chunk);
        dispatch({
          type: "FETCH_PARTIAL_SUCCESS",
          payload: loadedData,
        });
        chunkIndex++;
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      dispatch({ type: "FETCH_SUCCESS", payload: loadedData });
    } catch (error: any) {
      console.error(`Error fetching data for event ${eventName}:`, error);
      if (retryCount < retryLimit) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchData();
        }, retryInterval); // Retry after retryInterval milliseconds
      } else {
        dispatch({ type: "FETCH_FAILURE", error: error.message });
      }
    }
  }, [eventName, retryCount, retryLimit, retryInterval]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
};

export default useFetch;
