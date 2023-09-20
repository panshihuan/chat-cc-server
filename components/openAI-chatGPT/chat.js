  
  import { Configuration, OpenAIApi } from "openai";
  import axios from 'axios';
  import { API_KEY, organization } from '../../config.js';
  
  // 设置 OpenAI API 密钥
  const apiKey = API_KEY;
 
   // 初始化对话历史
   const conversationHistory = [];
 
   // 模拟用户输入和模型回应
   async function continueConversation(userInput) {
     conversationHistory.push({ role: "user", content: userInput });
     
     const completion = await axios({
       url: 'https://api.openai.com/v1/chat/completions',
       method: 'post',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${apiKey}`
       },
       data: {
         "model": "text-davinci-003",
         messages: conversationHistory,
       }
     })
 
     console.log(3333333, completion);
     const modelResponse = completion.data.choices[0].message;
     conversationHistory.push({ role: "system", content: modelResponse });
     return modelResponse;
   }
 
   // async function continueConversation(userInput) {
   //   conversationHistory.push({ role: "user", content: userInput });
 
   //   const configuration = new Configuration({
   //     organization,
   //     apiKey: apiKey,
   //   });
   //   const openai = new OpenAIApi(configuration);
 
   //   const completion = await openai.createChatCompletion({
   //     model: "text-davinci-003",
   //     messages: conversationHistory,
   //     temperature: 0,
   //     max_tokens: 1000
   //   },{
   //     proxy: {
   //       host: '127.0.0.1',
   //       port: 3090
   //     }
   //   });
   //   console.log(3333333, completion.data.choices[0].message);
 
   //   const modelResponse = completion.data.choices[0].message;
   //   conversationHistory.push({ role: "system", content: modelResponse });
 
   //   return modelResponse;
   // }
 
   // 生成对话的提示
   function generatePrompt(conversation) {
     return conversation
       .map((item) => `${item.role}: ${item.content}`)
       .join("\n");
   }
 
   // 主要逻辑
   async function main(userInput) {
     try {
       // const userInputs = ["Hello", "How are you?", "Tell me a joke."];
       const modelResponse = await continueConversation(userInput);
       console.log(`User: ${userInput}`);
       console.log(`AI: ${modelResponse}\n`);
       return {
        all: modelResponse,
       }
     } catch (error) {
       console.error("Error:", error);
     }
   }

  export default main;
