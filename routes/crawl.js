import express from "express";
import path from "path";
const router = express.Router();
import axios from "axios";
import db from "../db/index.js";
import schedule from "node-schedule";
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import srcToImg from "../helper/srcToImg.js";
import ora from "ora";
import puppeteer from "puppeteer";
import { awaitWrap, pingIp, moveHttp } from "../utils/index.js";


// puppeteer截图
router.get("/baidu", async function (req, res, next) {
  const browser = await puppeteer.launch({
    headless: false, // 是否不显示浏览器界面
  });
  const page = await browser.newPage(); // 创建一个新页面
  await page.goto("https://www.baidu.com", {
    timeout: 0, // 不限制超时时间
    waitUntil: "networkidle0",
  });
  //截屏
  const img = await page.screenshot({
    path: path.resolve(__dirname, `../crawl/screenshot/baidu-${Date.now()}.png`),
    type: "png",
    fullPage: true,
  });
  await browser.close(); // 关闭浏览器
})


// puppeteer获取百度图片
router.get("/baidu2", async function (req, res, next) {
  const browser = await puppeteer.launch({
    headless: false, // 是否不显示浏览器界面
  });
  const page = await browser.newPage(); // 创建一个新页面
  await page.goto("https://image.baidu.com", {
    timeout: 0, // 不限制超时时间
    waitUntil: "networkidle0",
  });
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  await page.focus("#kw");
  await page.keyboard.sendCharacter("猫");
  await page.click(".s_newBtn");
  page.on("load", async () => {
    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll("img.main_img");
      return Array.prototype.map.call(images, (img) => img.src);
    });
    srcs.forEach(async (src) => {
      await srcToImg(src, path.resolve(__dirname, "../crawl/mn"));
    });
    res.json({
      status: 200,
      data: srcs,
      msg: "ok",
    });
  })
})


// 扩展: 爬一些别的图片搜索网站,分类(按图片作用分类):头像/手机壁纸/表情包图片

export default {
  router,
  name: 'crawl'
};
