import { useParams } from "react-router-dom";

function Chat() {
  const { modelName } = useParams();

  const selectedModel = modelName ? decodeURIComponent(modelName) : "";

  return (
    <div>
      <h1>--Under Development--</h1>
      <h1>Chat Session</h1>
      <p>
        Active Model: <strong>{selectedModel}</strong>
      </p>
    </div>
  );
}

export default Chat;
