import { useRef } from "react";
import { toast } from "sonner";

export function useBatchNotifications(threshold = 2, delayMs = 15000) {
  const pendingRef = useRef<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function addNotification(message: string) {
    pendingRef.current.push(message);

    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        if (pendingRef.current.length >= threshold) {
          toast.warning(
            `${pendingRef.current.length} alerts in last ${delayMs / 1000} seconds`,
            { description: pendingRef.current.join("\n") }
          );
        }
        pendingRef.current = [];
        timerRef.current = null;
      }, delayMs);
    }
  }

  return { addNotification };
}
