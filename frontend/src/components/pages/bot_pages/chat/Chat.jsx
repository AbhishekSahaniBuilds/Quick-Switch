import { useParams } from "react-router-dom";
import { fetch_prompt_with_memory } from "../.././../../services/bot_api";
import { useState, useEffect, useRef } from "react";
import Button from ".././../../global/button/Button";

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

  const [inputText, setInputText] = useState("");
  const [temperature, setTemperature] = useState("0.7");
  const [sysPrompt, setSysPrompt] = useState("You are a teacher.");

  const [messages, setMessages] = useState([
    { role: "system", content: "You are a teacher." },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Ref hook allocated for container autoscroll indexing
  const messagesEndRef = useRef(null);

  // Auto-scroll pipeline effect trigger
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Simple parser function helper to render basic markdown bold blocks (**text**)
  const renderMessageContent = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleFetchPrompt = async (e) => {
    if (e) e.preventDefault();

    if (!inputText.trim()) {
      setErrorMessage("Error: Message cannot be empty.");
      return;
    }

    const tempFloat = parseFloat(temperature);
    if (isNaN(tempFloat) || tempFloat < 0 || tempFloat > 2) {
      setErrorMessage("Error: Temperature must be a number between 0 and 2.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const userMessage = { role: "user", content: inputText };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputText("");

    try {
      const response = await fetch_prompt_with_memory(
        activeProvider,
        activeCreator,
        activeModel,
        tempFloat,
        updatedHistory,
      );

      if (response && response.succeed === 1) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.output },
        ]);
      } else if (response && response.error) {
        setErrorMessage(
          typeof response.error === "object"
            ? JSON.stringify(response.error)
            : response.error,
        );
      } else {
        setErrorMessage("Received unexpected data format from backend.");
      }
    } catch (error) {
      setErrorMessage("Failed to load response from backend API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSysPromptChange = (newVal) => {
    setSysPrompt(newVal);
    setMessages((prev) => {
      const copy = [...prev];
      if (copy.length > 0 && copy[0].role === "system") {
        copy[0] = { ...copy[0], content: newVal };
      } else {
        copy.unshift({ role: "system", content: newVal });
      }
      return copy;
    });
  };

  // Reset thread clear event block handler
  const handleClearHistory = () => {
    setMessages([{ role: "system", content: sysPrompt }]);
    setErrorMessage("");
    setInputText("");
  };

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

      <div className="input-form-container">
        <div>
          <label>System Prompt:</label>
          <textarea
            value={sysPrompt}
            onChange={(e) => handleSysPromptChange(e.target.value)}
          />
        </div>

        <div>
          <label>Temperature (0.0 - 2.0):</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </div>

        {/* Reset Session Option Target */}
        <div onClick={handleClearHistory} className="clear-history-action">
          <Button>Clear Chat History</Button>
        </div>
      </div>

      <div className="chat-thread-window">
        {messages
          .filter((msg) => msg.role !== "system")
          .map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.role}`}>
              <strong className="message-sender">
                {msg.role === "user" ? "You" : "Bot"}
              </strong>
              <p className="message-content">
                {renderMessageContent(msg.content)}
              </p>
            </div>
          ))}
        {isLoading && <div className="chat-loading">Bot is typing...</div>}
        {/* Anchor point target container block element for scroll position tracking */}
        <div ref={messagesEndRef} />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="input-action-container">
        <textarea
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
        />
        <div onClick={!isLoading ? handleFetchPrompt : undefined}>
          <Button>{isLoading ? "Sending..." : "Send Message"}</Button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
