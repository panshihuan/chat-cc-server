import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { openai_access_token } from '../../config.js'


async function ChatGPTUnofficialProxy() {
  const api = new ChatGPTUnofficialProxyAPI({
    accessToken: openai_access_token
  })

    //   const res = await api.sendMessage('Hello World!')
    //   console.log(7766, res.text)
    return api.sendMessage('Hello World!')
}

export default ChatGPTUnofficialProxy