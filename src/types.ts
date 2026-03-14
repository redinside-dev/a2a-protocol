export enum MessageType {
  Request = "request",
  Response = "response",
  Notify = "notify",
}

export interface A2AMessage {
  id: string;
  from: string;
  to: string;
  type: MessageType;
  payload: unknown;
  timestamp: string;
}

export type MessageHandler = (msg: A2AMessage) => Promise<unknown> | unknown;
