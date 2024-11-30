export interface AcceptedFile extends File {
  preview: string;
}

export type EventHandler<T = any> = (data: T) => void;

export type RegisterEventHandler = (
  event: string,
  onData: EventHandler
) => void;
