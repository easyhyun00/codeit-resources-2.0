import { RefObject, useEffect } from "react";

interface Params {
  ref: RefObject<HTMLElement>;
  handler: (e: MouseEvent | TouchEvent) => void;
}

export default function useClickOutside({ ref, handler }: Params) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;

      handler(e);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
