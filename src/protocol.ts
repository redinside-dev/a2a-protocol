import http from "http";
import { HttpTransport } from "./transport";
import { A2AHandler, A2AMessage, MessageType } from "./types";

export class A2AProtocol {
  private handlers = new Map<MessageType, A2AHandler>();
  private transport = new HttpTransport();

  on(type: MessageType, handler: A2AHandler): void {
    this.handlers.set(type, handler);
  }

  async send(targetUrl: string, msg: A2AMessage): Promise<A2AMessage> {
    return this.transport.post(new URL(targetUrl), msg);
  }

  async broadcast(targets: string[], msg: A2AMessage): Promise<A2AMessage[]> {
    return Promise.all(targets.map((target) => this.send(target, msg)));
  }

  listen(port: number): http.Server {
    const server = http.createServer(async (req, res) => {
      if (req.method !== "POST" || req.url !== "/receive") {
        res.writeHead(404);
        return res.end("not found");
      }

      let raw = "";
      req.on("data", (chunk) => (raw += chunk));
      req.on("end", async () => {
        try {
          const message = JSON.parse(raw) as A2AMessage;
          const handler = this.handlers.get(message.type);
          const output = handler ? await handler(message) : { ok: true };
          const response: A2AMessage = {
            id: `${message.id}-response`,
            from: message.to,
            to: message.from,
            type: MessageType.RESPONSE,
            payload: output,
            timestamp: new Date().toISOString()
          };
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(response));
        } catch (err) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: (err as Error).message }));
        }
      });
    });

    server.listen(port);
    return server;
  }
}
