import { Link } from "react-router-dom";
import Button from "../../global/components/Button";
import "./module.css";

function Home() {
  return (
    <div className="pageWrapper">
      <div className="contentContainer">
        <div className="contentWrapper">
          <h1 className="titleWrapper">Quick Switch</h1>
          <h2 className="subtitleText">
            An intuitive chatbot designed for seamless model switching.
          </h2>

          <p className="bodyText">
            Quick Switch connects directly to multiple API providers, allowing
            you to instantly toggle between different LLMs on the fly.
          </p>

          <div className="buttonContainer">
            <Link to="/chat" style={{ textDecoration: "none" }}>
              <Button>Start a Session</Button>
            </Link>
          </div>

          <div className="metaDetailsContainer">
            <p className="metaOwner">
              An open-source project by Abhishek Sahani
            </p>
            <p className="metaDescription">
              Engineered with a high-performance Python backend powered by
              FastAPI, delivering low-latency model routing across Groq and
              Google AI Studio. The responsive client application is crafted
              using React and optimized for seamless real-time interactions.
            </p>
            <div className="metaLinks">
              <a
                href="https://github.com/AbhishekSahaniBuilds"
                target="_blank"
                rel="noopener noreferrer"
                className="metaLink"
              >
                GitHub Profile
              </a>
              <span className="divider">•</span>
              <a
                href="https://github.com/AbhishekSahaniBuilds/Quick-Switch"
                target="_blank"
                rel="noopener noreferrer"
                className="metaLink"
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
