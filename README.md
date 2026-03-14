# a2a-protocol

Lightweight TypeScript protocol for agent-to-agent request/response and broadcast.

## Setup
1. `npm install`
2. `npm start`

## Usage
```ts
import { A2AProtocol } from "./src/protocol";
import { MessageType } from "./src/types";

const protocol = new A2AProtocol();
protocol.on(MessageType.REQUEST, (msg) => ({ ok: true, echo: msg.payload }));
protocol.listen(7002);
```

## Example
Run `npm start` to execute `example/two-agents.ts`.
Expected output includes:
- `agent-B received: hello`
