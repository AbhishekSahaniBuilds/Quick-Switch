import { useParams } from "react-router-dom";

function Chat() {
  const { provider, creator, modelId, modelName } = useParams();

  const activeModel = modelId ? decodeURIComponent(modelId) : "Unknown Model";
  const activeProvider = provider
    ? decodeURIComponent(provider)
    : "Unknown Provider";
  const activeCreator = creator
    ? decodeURIComponent(creator)
    : "Unknown Creator";

  const activeModelName = modelName
    ? decodeURIComponent(modelName)
    : "Unknown Name";

  return (
    <div className="chat-container">
      <h2>--Under Development--</h2>
      <h1>Chat Session</h1>
      <p>
        <strong>Active Model:</strong> {activeModel}
      </p>
      <p>
        <strong>Provider:</strong> {activeProvider}
      </p>
      <p>
        <strong>Creator/Owner:</strong> {activeCreator}
      </p>
      <p>
        <strong>Name:</strong> {activeModelName}
      </p>
    </div>
  );
}

export default Chat;
