import http from "http";
import { A2AMessage } from "./types";

export class HttpTransport {
  async post(url: URL, message: A2AMessage): Promise<A2AMessage> {
    const payload = JSON.stringify(message);

    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: url.hostname,
          port: Number(url.port || 80),
          path: url.pathname,
          method: "POST",
          headers: {
            "content-type": "application/json",
            "content-length": Buffer.byteLength(payload)
          }
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            if (res.statusCode && res.statusCode >= 400) {
              return reject(new Error(`HTTP ${res.statusCode}: ${body}`));
            }
            try {
              resolve(JSON.parse(body || "{}"));
            } catch (err) {
              reject(err);
            }
          });
        }
      );

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }
}
