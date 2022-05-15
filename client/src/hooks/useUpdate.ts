import { useCallback, useState } from "react";

export const useUpdate = () => {
  const [, setState] = useState({});

  return useCallback(() => setState({}), []);
};
