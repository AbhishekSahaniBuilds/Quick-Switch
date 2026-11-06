//=======================================
//===============Root API================
//=======================================

import api_client from "./config.js";

export const fetch_root = async () => {
  try {
    const response = await api_client.get("/");
    return { succeed: 1, output: response.data };
  } catch (error) {
    return { succeed: 0, output: error };
  }
};
