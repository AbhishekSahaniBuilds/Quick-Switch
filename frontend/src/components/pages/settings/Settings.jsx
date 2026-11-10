import styles from "./Settings.module.css";
import { useState } from "react";

function Settings() {
  if (localStorage.getItem("temperature") === null) {
    localStorage.setItem("temperature", 0.7);
  }
  const [temperature, setTemperature] = useState(
    localStorage.getItem("temperature"),
  );

  if (localStorage.getItem("system_prompts") === null) {
    localStorage.setItem(
      "system_prompts",
      JSON.stringify([
        { role: "system", content: "You are a helpful Chat-Bot." },
      ]),
    );
  }
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("system_prompts"));
  });

  const sysPrompt =
    messages.find((msg) => msg.role === "system")?.content || "";

  const handleSysPromptChange = (newVal) => {
    setMessages((prev) => {
      let copy = [...prev];
      if (copy.length > 0 && copy[0]?.role === "system") {
        copy[0] = { ...copy[0], content: newVal };
      } else {
        copy.unshift({ role: "system", content: newVal });
      }

      localStorage.setItem("system_prompts", JSON.stringify(copy));
      return copy;
    });
  };
  const handleClearHistory = () => {
    const systemPrompts = JSON.parse(
      localStorage.getItem("system_prompts"),
    ) || [{ role: "system", content: "You are a helpful Chat-Bot." }];

    setMessages(systemPrompts);

    localStorage.removeItem("chat_history");

    setErrorMessage("");
    setInputText("");
    setIsSidebarOpen(false);

    setWelcomeTextInnerText(getRandomWelcomeText());
    setWelcomeState("hide");

    setTimeout(() => setWelcomeState("show"), 50);
  };

  return (
    <div>
      <h1>--Under Development---</h1>
      <p>Settings Page</p>
      <div className={styles.configGroup}>
        <label>Temperature ({temperature})</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setTemperature(val);
            localStorage.setItem("temperature", val);
          }}
        />
      </div>
      <div className={styles.configGroup}>
        <label>System Prompt</label>
        <textarea
          value={sysPrompt}
          onChange={(e) => handleSysPromptChange(e.target.value)}
          rows={4}
        />
      </div>{" "}
      <button
        type="button"
        className={styles.clearBtn}
        onClick={handleClearHistory}
      >
        Clear History
      </button>
      <div className={styles.metaDetailsContainer}>
        <div className={styles.metaLinks}>
          <a
            href="https://github.com/AbhishekSahaniBuilds"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.metaLink}
          >
            GitHub Profile
          </a>
          <span className={styles.divider}>•</span>
          <a
            href="https://github.com/AbhishekSahaniBuilds/Quick-Switch"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.metaLink}
          >
            Repository
          </a>
        </div>
      </div>
    </div>
  );
}

export default Settings;
