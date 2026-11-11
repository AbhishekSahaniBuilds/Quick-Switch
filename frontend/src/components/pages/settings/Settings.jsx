import styles from "./Settings.module.css";
import Button from "../../global/button/Button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DEFAULT_SYSTEM_PROMPT = "You are a helpful Chat-Bot.";

function getTemperature() {
  const stored = localStorage.getItem("temperature");

  if (stored === null) {
    localStorage.setItem("temperature", "0.7");
    return 0.7;
  }

  const value = Number(stored);

  return Number.isFinite(value) && value >= 0 && value <= 2 ? value : 0.7;
}

function getSystemPrompts() {
  try {
    const stored = localStorage.getItem("system_prompts");

    if (stored === null) {
      const defaults = [{ role: "system", content: DEFAULT_SYSTEM_PROMPT }];

      localStorage.setItem("system_prompts", JSON.stringify(defaults));
      return defaults;
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [{ role: "system", content: DEFAULT_SYSTEM_PROMPT }];
  } catch {
    return [{ role: "system", content: DEFAULT_SYSTEM_PROMPT }];
  }
}

function Settings() {
  const [temperature, setTemperature] = useState(getTemperature);
  const [messages, setMessages] = useState(getSystemPrompts);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const sysPrompt =
    messages.find((msg) => msg.role === "system")?.content || "";

  const handleTemperatureChange = (e) => {
    const value = Number(e.target.value);

    setTemperature(value);
    localStorage.setItem("temperature", String(value));
  };

  const handleSysPromptChange = (newVal) => {
    setMessages((prev) => {
      const copy = [...prev];

      const systemIndex = copy.findIndex((msg) => msg.role === "system");

      if (systemIndex !== -1) {
        copy[systemIndex] = {
          ...copy[systemIndex],
          content: newVal,
        };
      } else {
        copy.unshift({
          role: "system",
          content: newVal,
        });
      }

      localStorage.setItem("system_prompts", JSON.stringify(copy));

      return copy;
    });
  };

  const handleResetPrompt = () => {
    handleSysPromptChange(DEFAULT_SYSTEM_PROMPT);
  };

  const handleClearHistory = () => {
    localStorage.removeItem("chat_history");
    setShowConfirmation(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1 className={styles.titleWrapper}>Settings</h1>{" "}
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();

                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/");
                }
              }}
              style={{ textDecoration: "none" }}
            >
              <Button>Back</Button>
            </Link>
          </div>
          <p className={styles.subtitleText}>
            Customize your chatbot experience.
          </p>
          <p className={styles.bodyText}>
            Manage your chatbot's behavior, adjust response creativity, and
            personalize the way your AI assistant interacts with you. Your
            preferences are saved automatically.
          </p>
          <section className={styles.configGroup}>
            <div className={styles.settingHeader}>
              <label htmlFor="temperature">Model Temperature</label>

              <span className={styles.temperatureValue}>
                {temperature.toFixed(1)}
              </span>
            </div>

            <input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={handleTemperatureChange}
            />

            <div className={styles.rangeLabels}>
              <span>Precise</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>

            <p className={styles.helperText}>
              Lower values produce more focused responses, while higher values
              encourage creativity.
            </p>
          </section>
          <section className={styles.configGroup}>
            <div className={styles.settingHeader}>
              <label htmlFor="systemPrompt">System Prompt</label>

              <button
                type="button"
                className={styles.textButton}
                onClick={handleResetPrompt}
              >
                Reset Default
              </button>
            </div>

            <textarea
              id="systemPrompt"
              value={sysPrompt}
              onChange={(e) => handleSysPromptChange(e.target.value)}
              rows={5}
              placeholder="Enter your system prompt..."
            />

            <p className={styles.helperText}>
              Define the personality, instructions, and behavior of your
              chatbot.
            </p>
          </section>
          <section className={styles.clearSection}>
            <div>
              <h2 className={styles.sectionTitle}>Clear Chat History</h2>

              <p className={styles.helperText}>
                Remove all saved conversations from this browser. Your other
                settings will remain unchanged.
              </p>
            </div>

            {!showConfirmation ? (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => setShowConfirmation(true)}
              >
                Clear History
              </button>
            ) : (
              <div className={styles.confirmation}>
                <span>Are you sure?</span>

                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={handleClearHistory}
                >
                  Confirm
                </button>

                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </section>
          <div className={styles.metaDetailsContainer}>
            <h3 className={styles.metaOwner}>Quick Switch</h3>

            <p className={styles.metaDescription}>
              An open-source project built to make your AI chatbot experience
              super simple, customizable, fast.
            </p>

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
              </a>{" "}
              <a
                href="https://abhisheksahanibuilds.github.io/Doc-Stack/projects/Quick-Switch/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.metaLink}
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
