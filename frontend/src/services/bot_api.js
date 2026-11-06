//=======================================
//===============Bot API================
//=======================================

import api_client from "./config.js";

const bot_route = "/bot/";

export const fetch_get_models = async () => {
  try {
    const response = await api_client.get(`${bot_route}get_models`);
    return { succeed: 1, output: response.data };
  } catch (error) {
    return { succeed: 0, output: error };
  }
};
