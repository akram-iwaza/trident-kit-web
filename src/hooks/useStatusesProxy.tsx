import React, { useEffect, useState } from "react";
interface ProxyStatusUpdate {
  taskID: string; // Correct the type here
  message: { responseTime: number };
}

const useStatusesProxy = () => {
  const [taskStatuses, setTaskStatuses] = useState<{ [key: string]: string }>(
    {}
  );

  return taskStatuses;
};

export default useStatusesProxy;
