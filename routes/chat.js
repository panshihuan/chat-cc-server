import express from "express";
const router = express.Router();
import db from "../db/index.js";
import chatGPTSend from "../components/openAI-chatGPT/chat.js";
import sendChatGPTAPI from "../components/openAI-chatGPT/ChatGPTAPI.js";
import ChatGPTUnofficialProxy from '../components/openAI-chatGPT/ChatGPTUnofficialProxyAPI.js'


/* GET chat listing. */
router.get("/getList", function (req, res, next) {
  const sql = "select * from records";
  db.query(sql, (err, result) => {
    res.json({
      status: 200,
      data: result,
      msg: "ok",
    });
  });
});

/* 发送消息. */
router.post("/send", async function (req, res, next) {
  const sql = "select * from records where id = ?";
  db.query(sql, (err, result) => {
    res.json({
      status: 200,
      data: result,
      msg: "ok",
    });
  });
  // 获取openAI返回的结果
  // const chatGPTMessage = await chatGPTSend(req.body.message);
  // sendChatGPTAPI(req.body.message)
  ChatGPTUnofficialProxy(req.body.message).then((data) => {
    res.json({
      status: 200,
      data: data,
      msg: "ok",
    });
  }).catch((err) => {
    res.json({
      status: 500,
      data: err,
      msg: "err",
    });
  })
});

 

export default {
  router,
  name: 'chat'
};

