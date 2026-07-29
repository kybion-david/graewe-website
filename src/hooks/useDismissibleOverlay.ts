"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) =>
      !el.hasAttribute("disabled") &&
      el.getAttribute("aria-hidden") !== "true" &&
      el.tabIndex !== -1,
  );
}

type Options = {
  open: boolean;
  onClose: () => void;
  /** Cycle Tab within the container while open (drawers / modal menus). */
  trapFocus?: boolean;
  /** Element that opened the overlay; receives focus on close. */
  triggerRef?: RefObject<HTMLElement | null>;
};

/**
 * Escape closes the overlay and restores focus to the trigger.
 * Optionally traps Tab inside `containerRef` and moves focus in on open.
 */
export function useDismissibleOverlay(
  containerRef: RefObject<HTMLElement | null>,
  { open, onClose, trapFocus = false, triggerRef }: Options,
) {
  const onCloseRef = useRef(onClose);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef?.current ?? null;
    previousFocusRef.current =
      trigger ?? (document.activeElement as HTMLElement | null);

    const container = containerRef.current;
    const focusables = container ? getFocusable(container) : [];
    focusables[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (!trapFocus || event.key !== "Tab" || !container) return;

      const items = getFocusable(container);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const restore = trigger ?? previousFocusRef.current;
      restore?.focus();
    };
  }, [open, trapFocus, containerRef, triggerRef]);
}
