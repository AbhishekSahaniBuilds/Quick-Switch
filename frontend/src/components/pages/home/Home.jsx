import { Link } from "react-router-dom";
import Button from "../../global/button/Button";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.titleWrapper}>Quick Switch</h1>
          <h2 className={styles.subtitleText}>
            An intuitive chatbot designed for seamless model switching.
          </h2>

          <p className={styles.bodyText}>
            Quick Switch connects directly to multiple API providers, allowing
            you to instantly toggle between different LLMs on the fly.
          </p>

          <div className={styles.buttonContainer}>
            <Link to="/model" style={{ textDecoration: "none" }}>
              <Button>Start the Session</Button>
            </Link>
          </div>

          <div className={styles.metaDetailsContainer}>
            <p className={styles.metaOwner}>
              An open-source project by Abhishek Sahani
            </p>
            <p className={styles.metaDescription}>
              Engineered with a high-performance Python backend powered by
              FastAPI, delivering low-latency model routing across Groq. The
              responsive client application is crafted using React and optimized
              for seamless real-time interactions.
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
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
