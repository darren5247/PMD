import { RefObject } from 'react';
import { useEventListener } from 'usehooks-ts';

type Handler = (event: Event | MouseEvent | TouchEvent) => void;

export function useOnEventOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: 'mousedown' | 'scroll' | 'blur'
): void {
  useEventListener(mouseEvent, (event) => {
    const el = ref?.current;

    // Do nothing if clicking ref's element or descendent elements
    if (!el || el.contains(event.target as Node)) {
      return;
    };

    handler(event);
  }
  );
};
