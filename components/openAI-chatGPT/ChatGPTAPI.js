import { API_KEY } from '../../config.js';
import { ChatGPTAPI } from 'chatgpt';

const sendChatGPTAPI = async () => {
  const api = new ChatGPTAPI({
    apiKey: API_KEY
  })

  const res = await api.sendMessage('Hello World!')
  console.log(6666, res.text)
}

export default sendChatGPTAPI;
