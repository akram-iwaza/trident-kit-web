import { useReducer, useEffect } from "react";
import statusEmitter from "./statusEmitter";

interface StatusMessage {
  message: string;
  taskID: string;
  error: boolean;
  success: boolean;
}

type StatusState = Map<string, StatusMessage>;

type Action =
  | { type: "SET_STATUS"; payload: StatusMessage }
  | { type: "INITIALIZE"; payload: StatusState };

const statusReducer = (state: StatusState, action: Action): StatusState => {
  switch (action.type) {
    case "SET_STATUS":
      const updatedState = new Map(state);
      updatedState.set(action.payload.taskID, action.payload);
      return updatedState;
    case "INITIALIZE":
      return action.payload;
    default:
      return state;
  }
};

const useStatusMessages = () => {
  const [statuses, dispatch] = useReducer(statusReducer, new Map());

  useEffect(() => {
    const handleSetMyStatus = (event: any, data: StatusMessage) => {
      dispatch({ type: "SET_STATUS", payload: data });
      statusEmitter.emit("update");
    };
  }, []);

  return { statuses, dispatch }; // Return both statuses and dispatch
};

export default useStatusMessages;
