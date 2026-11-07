import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "./model_button/Button";
import styles from "./AskModel.module.css";
import { fetch_get_models } from "../../../../services/bot_api";

function AskModel() {
  const modelListRef = useRef(null);
  const [modelList, setModelList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadModels() {
      try {
        const response = await fetch_get_models();
        if (!response["succeed"]) {
          setError("internal_error");
          return;
        }
        modelListRef.current = response;
        setModelList(response.output?.output || {});
      } catch (err) {
        setError("failed_to_load");
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, []);

  if (error === "internal_error" || error === "failed_to_load") {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.contentWrapper}>
            <div className={styles.topHeadingSection}>
              <Link to="/">
                <Button>Back</Button>
              </Link>
              <h1 className={styles.titleWrapper}>Something Went Wrong!</h1>
            </div>
            <h2 className={styles.subtitleText}>
              Some internal error has occurred. Please try again later.
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.topHeadingSection}>
            <Link to="/">
              <Button>Back</Button>
            </Link>
            <h1 className={styles.titleWrapper}>Select One Model</h1>
          </div>
          <h2 className={styles.subtitleText}>
            Select a Model from the list to start the Session.
          </h2>
          <div className={styles.selectModelWrapper}>
            {loading && <p className={styles.loadingText}>Loading Models...</p>}
            {!loading &&
              modelList &&
              Object.entries(modelList).map(([provider, creators]) => (
                <div key={provider} className={styles.providerSection}>
                  <h3 className={styles.modelProviderName}>{provider}</h3>
                  {Object.entries(creators).map(([creator, models]) => (
                    <div key={creator} className={styles.creatorSection}>
                      <h4 className={styles.modelOwnerTitle}>{creator}</h4>
                      <div className={styles.modelList}>
                        {Array.isArray(models) &&
                          models.map((model) => (
                            <p key={model} className={styles.modelName}>
                              <Link
                                to={`/chat/${encodeURIComponent(`${provider}/${creator}/${model}`)}`}
                              >
                                <Button>{model}</Button>
                              </Link>
                            </p>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AskModel;
