import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

import Button from ".././../../global/button/Button";
import { fetch_prompt_with_memory } from "../.././../../services/bot_api";
import styles from "./Chat.module.css";

// ============================================================================
// CONFIGURATIONS & STATIC STRUCTS
// ============================================================================

const WELCOME_MESSAGES = [
  "Hello, How can I help you?",
  "What is todays goal?",
  "sqrt(-1) am Quick Switch!",
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

const MATH_SYMBOL_MAP = {
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

// ============================================================================
// DATA TRANSFORMATION PIPELINES
// ============================================================================

const getRandomWelcomeText = () => {
  return WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
};

const formatLLMText = (text) => {
  if (!text) return "";

  let processedText = text
    // Replace fractional fragments: \frac{a}{b} -> (a) / (b)
    .replace(/\\frac\s*{(.*?)}{(.*?)}/g, "($1) / ($2)")
    // Replace square root fragments: \sqrt{a} -> √(a)
    .replace(/\\sqrt\s*{(.*?)}/g, "√($1)")
    // Replace isolated plus-minus macros
    .replace(/\\pm/g, "±")
    .replace(/\\mp/g, "∓")
    // Replace structural operations symbols
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\div/g, "÷");

  // 2. Fall back to standard map configurations
  processedText = processedText.replace(/;;\s*(.*?)\s*;;/g, (match, p1) => {
    const cleanKey = p1.trim();
    return MATH_SYMBOL_MAP[cleanKey] ? ` ${MATH_SYMBOL_MAP[cleanKey]} ` : match;
  });

  // 3. Process layout formatting blocks
  return processedText
    .replace(
      /(?:\r?\n|^)\[\s*([\s\S]*?)\s*\](?:\r?\n|$)/g,
      "\n\n$$$\n$1\n$$$\n\n",
    )
    .replace(/\\\(([\s\S]*?)\\\)/g, "$$1$")
    .replace(/\(([^)\n]*?\\[a-zA-Z0-9^_+=\-*/<>|]+[^)\n]*?)\)/g, "$$1$");
};
// ============================================================================
// PRESENTATIONAL BLOCKS (CODE RENDER DRAWER)
// ============================================================================

function MathBoardBlock({
  cleanRaw,
  uniqueBlockId,
  copiedIndex,
  onCopy,
  className,
  ...props
}) {
  const displayedMathCode = cleanRaw
    .replace(/^mathboard\s*/i, "")
    .replace(/^math\s*/i, "");

  return (
    <div className={styles.mathBlockWrapper}>
      <div className={styles.mathBlockHeader}>
        <span>MATH BOARD</span>
      </div>
      <pre className={styles.mathBlockPre} {...props}>
        <code className={className}>{displayedMathCode}</code>
      </pre>
      <div className={styles.mathBlockFooter}>
        <button
          type="button"
          className={styles.copyButton}
          onClick={() => onCopy(displayedMathCode, uniqueBlockId)}
        >
          {copiedIndex === uniqueBlockId ? "Copied!" : "🗐"}
        </button>
      </div>
    </div>
  );
}

function StandardCodeBlock({
  rawCode,
  lang,
  uniqueBlockId,
  copiedIndex,
  onCopy,
  className,
  ...props
}) {
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
          onClick={() => onCopy(rawCode, uniqueBlockId)}
        >
          {copiedIndex === uniqueBlockId ? "Copied!" : "🗐"}
        </button>
      </div>
    </div>
  );
}
// ============================================================================
// MAIN STATE CORE & INTERFACE FLOW
// ============================================================================
function Chat() {
  // --- Local Storage ---
  if (localStorage.getItem("temperature") === null) {
    localStorage.setItem("temperature", 0.7);
  }
  if (localStorage.getItem("system_prompts") === null) {
    localStorage.setItem(
      "system_prompts",
      JSON.stringify([
        { role: "system", content: "You are a helpful Chat-Bot." },
      ]),
    );
  }

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

  // --- Core Application State Definitions ---
  const temperature = localStorage.getItem("temperature");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("chat_history")) ||
        JSON.parse(localStorage.getItem("system_prompts")) || [
          { role: "system", content: "You are a helpful Chat-Bot." },
        ]
      );
    } catch {
      return [{ role: "system", content: "You are a helpful Chat-Bot." }];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [welcomeState, setWelcomeState] = useState("hide");
  const [welcomeTextInnerText, setWelcomeTextInnerText] =
    useState(getRandomWelcomeText);
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  // --- Core References & Derived Flags ---
  const messagesEndRef = useRef(null);
  const conversationStarted = messages.some((msg) => msg.role !== "system");

  // --- Runtime Side-Effects ---
  useEffect(() => {
    const timer = setTimeout(() => setWelcomeState("show"), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // --- Action Operations & Interaction Core ---
  const handleCopyCode = async (codeText, uniqueId) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedIndex(uniqueId);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
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
      if (response?.succeed === 1) {
        streamResponse(response.output);
      } else {
        setErrorMessage(
          response?.error
            ? typeof response.error === "object"
              ? JSON.stringify(response.error)
              : response.error
            : "Received unexpected data format from backend.",
        );
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Failed to load response from backend API.");
      setIsLoading(false);
    }
  };

  // --- Layout Template Node Tree Reflection ---
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

        <div className={styles.sidebarButtons}>
          <Link to="/settings" onClick={() => setIsSidebarOpen(false)}>
            <Button>Settings</Button>
          </Link>

          <Link to="/model" onClick={() => setIsSidebarOpen(false)}>
            <Button>Choose another Model</Button>
          </Link>

          <Link to="/" onClick={() => setIsSidebarOpen(false)}>
            <Button>Back</Button>
          </Link>
        </div>
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
                        const lang = match ? match[1] : "";
                        const rawCode = String(children).replace(/\n$/, "");
                        const uniqueBlockId = `${index}-${rawCode.substring(0, 10)}`;

                        if (
                          inline ||
                          !rawCode.includes("\n") ||
                          rawCode.length <= 4 ||
                          ["code", "cmd"].includes(rawCode.toLowerCase())
                        ) {
                          return (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }

                        const cleanRaw = rawCode.trim();
                        const isMathBoard =
                          ["mathboard", "math"].includes(lang.toLowerCase()) ||
                          cleanRaw.toLowerCase().startsWith("mathboard") ||
                          cleanRaw.toLowerCase().startsWith("math");

                        return isMathBoard ? (
                          <MathBoardBlock
                            cleanRaw={cleanRaw}
                            uniqueBlockId={uniqueBlockId}
                            copiedIndex={copiedIndex}
                            onCopy={handleCopyCode}
                            className={className}
                            {...props}
                          />
                        ) : (
                          <StandardCodeBlock
                            rawCode={rawCode}
                            lang={lang}
                            uniqueBlockId={uniqueBlockId}
                            copiedIndex={copiedIndex}
                            onCopy={handleCopyCode}
                            className={className}
                            {...props}
                          />
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
