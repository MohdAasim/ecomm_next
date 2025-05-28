import { useEffect } from "react";
import type { DependencyList } from "react";

export function useDebouncedEffect(
  effect: () => void,
  deps: DependencyList,
  delay: number,
): void {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line
  }, [effect, delay, ...deps]);
}
