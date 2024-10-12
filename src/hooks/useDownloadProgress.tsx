// hooks/useDownloadProgress.ts

import React, { useEffect, useState } from "react";

const useDownloadProgress = () => {
  const [percent, setPercent] = useState(0);

  return percent;
};

export default useDownloadProgress;
