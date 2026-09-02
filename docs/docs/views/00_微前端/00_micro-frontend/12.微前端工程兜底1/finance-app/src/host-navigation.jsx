import { createContext, useContext } from "react";

export const HostNavigationContext = createContext({
  isEmbedded: false,
  navigate: null,
});

export function useHostNavigation() {
  return useContext(HostNavigationContext);
}
