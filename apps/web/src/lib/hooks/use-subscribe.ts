import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";
import { RegisterEventHandler } from "../types";
import { getPusherClient } from "../pusher";

interface UseSubscribeProps<TData> {
  channel: string;
  event?: string;
  onData?: (data: TData) => void;
}

/**
 * Subscribe to a pusher channel
 * Can pass in the event and onData handler for basic usecases
 * For advanced use cases with a single channel + multiple events,
 * use the `registerEventHandler` function returned by this hook
 * @returns
 */
export function useSubscribe<TData = any>({
  channel,
  event,
  onData,
}: UseSubscribeProps<TData>) {
  const subscription = useRef<Channel>(null);

  useEffect(() => {
    const pusher = getPusherClient();

    subscription.current = pusher.subscribe(channel);
    if (event && onData) {
      subscription.current.bind(event, onData);
    }

    return () => {
      if (!subscription.current) return;
      if (event && onData) {
        subscription.current.unbind(event, onData);
      }
      // TODO: why does this unsubscribe twice? This causes issues with switching between
      // workflows; the subscription is unsubscribed, so no more realtime updates
      // subscription.current.unsubscribe();
    };
  }, [channel, event, onData]);

  const registerEventHandler: RegisterEventHandler = useCallback(
    (event, callback) => {
      if (!subscription.current) {
        const pusher = getPusherClient();
        subscription.current = pusher.subscribe(channel);
      }
      subscription.current.bind(event, callback);
    },
    [subscription.current, channel]
  );

  const unregisterEventHandler: RegisterEventHandler = useCallback(
    (event, callback) => {
      if (!subscription.current) {
        const pusher = getPusherClient();
        subscription.current = pusher.subscribe(channel);
      }
      subscription.current.unbind(event, callback);
    },
    [subscription.current, channel]
  );

  return { subscription, registerEventHandler, unregisterEventHandler };
}
