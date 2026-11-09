import { useParams, Link } from "react-router-dom";
import { fetch_prompt_with_memory } from "../.././../../services/bot_api";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import Button from ".././../../global/button/Button";
import styles from "./Chat.module.css";

const possibleWelcomeTexts = [
  "Hello, How can I help you?",
  "What is todays goal?",
  "sqrt(-1) am a chat bot!",
  "01001000 01100101 01101100 01101100 01101111 (That means Hello in binary).",
  ".... . .-.. .-.. --- (That means Hello in Morse code)",
  "Running thoughts.exe... How can I assist you today?",
  "I'm online. You're online. Let's make some magic happen.",
  "Welcome! What are we conquering today?",
  "Let's turn your to-do list into a done list.",
  "Ready to brainstorm? Hit me with your best ideas.",
  "New day, new inputs. What's the game plan?",
  "Plotting world domination, or just need a quick answer? I'm ready.",
  "Oh, hey there! Glad you dropped by.",
  "Tell me your secrets... or just what you need help with.",
  "I have the answers. (Assuming you have the questions).",
  "Let's skip the small talk. What can I do for you?",
  "Greetings, human. What knowledge do you seek?",
  "A glitch in the matrix brought you here. Welcome.",
  "Loading your next great breakthrough...",
];

const getRandomWelcomeText = () => {
  return possibleWelcomeTexts[
    Math.floor(Math.random() * possibleWelcomeTexts.length)
  ];
};

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
  const [temperature, setTemperature] = useState(0.7);
  const [sysPrompt, setSysPrompt] = useState("You are a helpful Chat-Bot.");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful Chat-Bot." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [welcomeState, setWelcomeState] = useState("hide");
  const [welcomeTextInnerText, setWelcomeTextInnerText] =
    useState(getRandomWelcomeText);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setWelcomeState("show"), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const conversationStarted = messages.some((msg) => msg.role !== "system");

  const formatLLMText = (text) => {
    if (!text) return "";

    const symbolMap = {
      "\\images": "\\implies",
      "\\Longrightarrow": "\\implies",
      "\\Rightarrow": "\\implies",
      "=>": "\\implies",
      "->": "\\implies",
      "\\rightarrow": "\\implies",
      "\\Longleftrightarrow": "\\iff",
      "\\Leftrightarrow": "\\iff",
      "<=>": "\\iff",
      "<->": "\\iff",
      "\\longmapsto": "\\mapsto",
      "\\mapsto": "\\mapsto",
      "\\partial": "\\partial",
      "d/dx": "\\partial",
      "\\nabla": "\\nabla",
      del: "\\nabla",
      "\\hbar": "\\hbar",
      "\\in": "\\in",
      memberof: "\\in",
      "\\notin": "\\in",
      "\\subset": "\\subset",
      "\\subseteq": "\\subseteq",
      "\\forall": "\\forall",
      "\\exists": "\\exists",
      "\\times": "\\times",
      "*": "\\times",
      "\\*": "\\times",
      "\\div": "\\div",
      "\\pm": "\\pm",
      "\\mp": "\\mp",
      "\\neq": "\\neq",
      "!=": "\\neq",
      "\\approx": "\\approx",
      "~": "\\approx",
      "\\propto": "\\propto",
      "\\cdot": "\\cdot",
      "\\sum": "\\sum",
      "\\prod": "\\prod",
      "\\int": "\\int",
      "\\oint": "\\oint",
      "\\infty": "\\infty",
      inf: "\\infty",
    };

    return text
      .replace(/;;\s*(.*?)\s*;;/g, (match, p1) => {
        const cleanKey = p1.trim();
        return symbolMap[cleanKey] ? ` ${symbolMap[cleanKey]} ` : match;
      })
      .replace(
        /(?:\r?\n|^)\[\s*([\s\S]*?)\s*\](?:\r?\n|$)/g,
        "\n\n$$$\n$1\n$$$\n\n",
      )
      .replace(/\\\(([\s\S]*?)\\\)/g, "$$1$")
      .replace(/\(([^)\n]*?\\[a-zA-Z0-9^_+=\-*/<>|]+[^)\n]*?)\)/g, "$$1$");
  };

  const handleCopyCode = async (codeText, uniqueId) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedIndex(uniqueId);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      setErrorMessage("Failed to copy code to clipboard.");
    }
  };

  const streamResponse = (fullText) => {
    const tokens = fullText.split(/(\s+)/);
    let tokenIndex = 0;
    let currentText = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const interval = setInterval(() => {
      if (tokenIndex < tokens.length) {
        currentText += tokens[tokenIndex];
        tokenIndex++;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: currentText,
          };
          return updated;
        });
      } else {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 10);
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
        streamResponse(response.output);
      } else if (response && response.error) {
        setErrorMessage(
          typeof response.error === "object"
            ? JSON.stringify(response.error)
            : response.error,
        );
        setIsLoading(false);
      } else {
        setErrorMessage("Received unexpected data format from backend.");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("Failed to load response from backend API.");
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

  const handleClearHistory = () => {
    setMessages([{ role: "system", content: sysPrompt }]);
    setErrorMessage("");
    setInputText("");
    setIsSidebarOpen(false);
    setWelcomeTextInnerText(getRandomWelcomeText());
    setWelcomeState("hide");
    setTimeout(() => setWelcomeState("show"), 50);
  };
  return (
    <div className={styles.chatContainer}>
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarActive : ""}`}
      >
        <div className={styles.modelHeader}>
          <h2>{activeModelName}</h2>
          <span className={styles.metaBadge}>{activeProvider}</span>
          <span className={styles.metaBadge}>{activeCreator}</span>
        </div>

        <div className={styles.configGroup}>
          <label>System Prompt</label>
          <textarea
            value={sysPrompt}
            onChange={(e) => handleSysPromptChange(e.target.value)}
            rows={4}
          />
        </div>

        <div className={styles.configGroup}>
          <label>Temperature ({temperature})</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </div>

        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClearHistory}
        >
          Clear History
        </button>

        <Link to="/model" onClick={() => setIsSidebarOpen(false)}>
          <Button>Choose another Model</Button>
        </Link>
      </div>
      <div className={styles.chatMain}>
        {!conversationStarted && (
          <div className={styles.welcomeText} data-state={welcomeState}>
            {welcomeTextInnerText}
          </div>
        )}

        <div className={styles.mobileNavbar}>
          <button
            type="button"
            className={styles.menuTrigger}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Navigation Side Menu"
          >
            <div className={styles.dash}></div>
            <div className={styles.dash}></div>
            <div className={styles.dash}></div>
          </button>
          <span className={styles.mobileTitle}>{activeModelName}</span>
        </div>
        <div className={styles.messagesWindow}>
          {messages.map((msg, index) => {
            if (msg.role === "system") return null;

            return (
              <div
                key={index}
                className={`${styles.messageRow} ${styles[msg.role]}`}
              >
                <div className={styles.bubble}>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        let lang = match ? match[1] : "";
                        let rawCode = String(children).replace(/\n$/, "");
                        const uniqueBlockId = `${index}-${rawCode.substring(0, 10)}`;

                        const isInlineOrSmall =
                          inline ||
                          !rawCode.includes("\n") ||
                          rawCode.length <= 4 ||
                          rawCode.toLowerCase() === "code" ||
                          rawCode.toLowerCase() === "cmd";

                        if (isInlineOrSmall) {
                          return (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }

                        const cleanRaw = rawCode.trim();
                        const isMathBoard =
                          lang.toLowerCase() === "mathboard" ||
                          lang.toLowerCase() === "math" ||
                          cleanRaw.toLowerCase().startsWith("mathboard") ||
                          cleanRaw.toLowerCase().startsWith("math");

                        if (isMathBoard) {
                          const displayedMathCode = cleanRaw
                            .replace(/^mathboard\s*/i, "")
                            .replace(/^math\s*/i, "");

                          return (
                            <div className={styles.mathBlockWrapper}>
                              <div className={styles.mathBlockHeader}>
                                <span>MATH BOARD</span>
                              </div>
                              <pre className={styles.mathBlockPre} {...props}>
                                <code className={className}>
                                  {displayedMathCode}
                                </code>
                              </pre>
                              <div className={styles.mathBlockFooter}>
                                <button
                                  type="button"
                                  className={styles.copyButton}
                                  onClick={() =>
                                    handleCopyCode(
                                      displayedMathCode,
                                      uniqueBlockId,
                                    )
                                  }
                                >
                                  {copiedIndex === uniqueBlockId
                                    ? "Copied!"
                                    : "🗐"}
                                </button>
                              </div>
                            </div>
                          );
                        }

                        const displayedCode =
                          lang.toLowerCase() === "whitespace"
                            ? rawCode.replace(/ /g, "·").replace(/\t/g, "→\t")
                            : rawCode;

                        return (
                          <div className={styles.codeBlockWrapper}>
                            <div className={styles.codeBlockHeader}>
                              <span>{lang || "code"}</span>
                            </div>
                            <pre className={styles.codeBlockPre} {...props}>
                              <code className={className}>{displayedCode}</code>
                            </pre>
                            <div className={styles.codeBlockFooter}>
                              <button
                                type="button"
                                className={styles.copyButton}
                                onClick={() =>
                                  handleCopyCode(rawCode, uniqueBlockId)
                                }
                              >
                                {copiedIndex === uniqueBlockId
                                  ? "Copied!"
                                  : "🗐"}
                              </button>
                            </div>
                          </div>
                        );
                      },
                    }}
                  >
                    {formatLLMText(msg.content)}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}

          {isLoading && !messages[messages.length - 1]?.content && (
            <div className={`${styles.messageRow} ${styles.assistant}`}>
              <div className={`${styles.bubble} ${styles.loadingBubble}`}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputAreaContainer}>
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
          <form onSubmit={handleFetchPrompt} className={styles.inputForm}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
          <p className={styles.bottomInfoText}>
            Quick Switch is an AI assistant and may make mistakes • Do not share
            personal information • All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chat;
