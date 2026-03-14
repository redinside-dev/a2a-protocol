# a2a-protocol

Lightweight TypeScript protocol for agent-to-agent messages over HTTP.

## Install

```bash
git clone https://github.com/redinside-dev/a2a-protocol.git
cd a2a-protocol
npm install
npm run demo
```

## Usage

```ts
const protocol = new A2AProtocol("agent-A");
protocol.on(MessageType.Request, (msg) => `echo:${String(msg.payload)}`);
protocol.listen(3001);
await protocol.send("127.0.0.1", 3001, {
  id: "1", from: "agent-A", to: "agent-A", type: MessageType.Request, payload: "hello"
});
```

Running `npm run demo` prints `agent-B received: hello`.
