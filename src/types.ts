export enum MessageType {
  REQUEST = "request",
  RESPONSE = "response",
  NOTIFY = "notify"
}

export interface A2AMessage {
  id: string;
  from: string;
  to: string;
  type: MessageType;
  payload: unknown;
  timestamp: string;
}

export type A2AHandler = (msg: A2AMessage) => Promise<unknown> | unknown;
