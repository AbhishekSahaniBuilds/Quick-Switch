//=======================================
//===============Bot API================
//=======================================

import api_client from "./config.js";

const bot_route = "/bot/";

export const fetch_get_models = async () => {
  try {
    const response = await api_client.get(`${bot_route}get_models`);
    if (response.data["succeed"]) {
      return { succeed: 1, output: response.data["output"] };
    } else {
      return { succeed: 0, error: response.data["error"] };
    }
  } catch (error) {
    return { succeed: 0, output: error };
  }
};

export const fetch_prompt = async (
  provider,
  owner,
  model,
  temperature = 0.7,
  prompt,
  sys_prompt,
) => {
  try {
    let promptInfo = {
      provider: provider,
      owner: owner,
      model: model,
      temperature: temperature,
      prompt: prompt,
      sys_prompt: sys_prompt,
    };
    const response = await api_client.post(`${bot_route}prompt`, promptInfo);
    if (response.data["succeed"]) {
      return { succeed: 1, output: response.data["output"] };
    } else {
      return { succeed: 0, error: response.data["error"] };
    }
  } catch (error) {
    return { succeed: 0, output: error };
  }
};
