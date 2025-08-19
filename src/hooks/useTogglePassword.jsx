import { useState } from "react";

export function useTogglePassword(initialState = false) {
  const [visible, setVisible] = useState(initialState);

  const toggle = () => setVisible((prev) => !prev);

  return [visible, toggle];
}