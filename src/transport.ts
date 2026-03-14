import http from "node:http";
import { A2AMessage } from "./types";

export type Receiver = (msg: A2AMessage) => Promise<A2AMessage>;

export class HttpTransport {
  request(host: string, port: number, path: string, msg: A2AMessage): Promise<A2AMessage> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(msg);
      const req = http.request(
        { host, port, path, method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
        (res) => {
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => {
            if (!data) return reject(new Error("empty response"));
            resolve(JSON.parse(data) as A2AMessage);
          });
        }
      );
      req.on("error", reject);
      req.write(body);
      req.end();
    });
  }

  listen(port: number, receiver: Receiver): http.Server {
    const server = http.createServer(async (req, res) => {
      if (req.method !== "POST" || req.url !== "/receive") {
        res.statusCode = 404;
        return res.end("not found");
      }
      let raw = "";
      req.on("data", (c) => (raw += c));
      req.on("end", async () => {
        try {
          const incoming = JSON.parse(raw) as A2AMessage;
          const outgoing = await receiver(incoming);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(outgoing));
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "invalid message" }));
        }
      });
    });
    server.listen(port);
    return server;
  }
}
