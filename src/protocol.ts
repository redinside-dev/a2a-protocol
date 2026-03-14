import { HttpTransport } from "./transport";
import { A2AMessage, MessageHandler, MessageType } from "./types";

export class A2AProtocol {
  private handlers = new Map<MessageType, MessageHandler>();
  private transport = new HttpTransport();

  constructor(private readonly agentId: string) {}

  on(type: MessageType, fn: MessageHandler): void {
    this.handlers.set(type, fn);
  }

  async send(host: string, port: number, msg: Omit<A2AMessage, "timestamp">): Promise<A2AMessage> {
    return this.transport.request(host, port, "/receive", { ...msg, timestamp: new Date().toISOString() });
  }

  broadcast(targets: Array<{ host: string; port: number }>, msg: Omit<A2AMessage, "timestamp">): Promise<A2AMessage[]> {
    return Promise.all(targets.map((t) => this.send(t.host, t.port, msg)));
  }

  listen(port: number) {
    return this.transport.listen(port, async (incoming) => {
      const fn = this.handlers.get(incoming.type);
      if (!fn) {
        return this.reply(incoming, { error: `no handler for ${incoming.type}` });
      }
      const payload = await fn(incoming);
      return this.reply(incoming, payload);
    });
  }

  private reply(incoming: A2AMessage, payload: unknown): A2AMessage {
    return {
      id: `${incoming.id}:reply`,
      from: this.agentId,
      to: incoming.from,
      type: MessageType.Response,
      payload,
      timestamp: new Date().toISOString(),
    };
  }
}
