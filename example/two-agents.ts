import { A2AProtocol } from "../src/protocol";
import { MessageType } from "../src/types";

async function main() {
  const agentB = new A2AProtocol("agent-B");
  agentB.on(MessageType.Request, (msg) => {
    console.log(`agent-B received: ${String(msg.payload)}`);
    return "ack";
  });
  const server = agentB.listen(3002);

  const agentA = new A2AProtocol("agent-A");
  const reply = await agentA.send("127.0.0.1", 3002, {
    id: "m1",
    from: "agent-A",
    to: "agent-B",
    type: MessageType.Request,
    payload: "hello",
  });

  console.log("agent-A got:", reply.payload);
  server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
