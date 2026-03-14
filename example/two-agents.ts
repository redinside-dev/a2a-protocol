import { A2AProtocol } from "../src/protocol";
import { MessageType } from "../src/types";

const agentB = new A2AProtocol();
agentB.on(MessageType.REQUEST, (msg) => {
  console.log("agent-B received:", (msg.payload as { text: string }).text);
  return { text: "pong" };
});
agentB.listen(7002);

const agentA = new A2AProtocol();

(async () => {
  const response = await agentA.send("http://localhost:7002/receive", {
    id: "msg-1",
    from: "agent-A",
    to: "agent-B",
    type: MessageType.REQUEST,
    payload: { text: "hello" },
    timestamp: new Date().toISOString()
  });

  console.log("agent-A got response:", response.payload);
  process.exit(0);
})();
