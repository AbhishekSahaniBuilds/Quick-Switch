import { useParams } from "react-router-dom";

function Chat() {
  const { modelInfo } = useParams();

  const modelInfoDecoded = modelInfo ? decodeURIComponent(modelInfo) : "";

  const [modelProvider, modelOwner, selectedModel] = modelInfoDecoded
    ? modelInfoDecoded.split("/")
    : ["", "", ""];

  return (
    <div>
      <h1>--Under Development--</h1>
      <h1>Chat Session</h1>
      <p>
        Active Model: <strong>{selectedModel || "None Selected"}</strong>
      </p>
      <p>Provider: {modelProvider}</p>
      <p>Creator/Owner: {modelOwner}</p>
    </div>
  );
}

export default Chat;
