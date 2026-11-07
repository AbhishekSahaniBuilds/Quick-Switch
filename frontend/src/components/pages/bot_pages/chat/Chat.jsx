import { useParams } from "react-router-dom";

function Chat() {
  // Pull variables immediately using destructured syntax from React Router
  const { provider, creator, modelId } = useParams();

  // Safely decode the tokens in case they contain encoded spaces or symbols
  const activeModel = modelId ? decodeURIComponent(modelId) : "Unknown Model";
  const activeProvider = provider
    ? decodeURIComponent(provider)
    : "Unknown Provider";
  const activeCreator = creator
    ? decodeURIComponent(creator)
    : "Unknown Creator";

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
    </div>
  );
}

export default Chat;
