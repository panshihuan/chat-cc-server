import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const writeFile = promisify(fs.writeFile);

// url ==> image
const urlToImg = promisify((url, dir) => {
  const mod = /^https:/.test(url) ? https : http;
  let ext = path.extname(url);
  // const example = 'https://img1.baidu.com/it/u=1092398299,4052881452&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666'
  const regex = /[?&]f=([a-zA-Z]+)/;
  const match = url.match(regex);
  const extension = `.${match[1].toLowerCase()}`;
  ext = ext || extension || '.png';
  console.log(2233, ext);
  const file = path.join(dir, `${Date.now()}${ext}`);

  mod.get(url, (res) => {
    res.pipe(fs.createWriteStream(file)).on("finish", () => {
      console.log(file);
    });
  });
});

// base64 ==> image
const base64ToImg = async function (base64Str, dir) {
  // data:image/jpeg;base64,/asdasdasdasdasd
  const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
  try {
    const ext = matches[1].split("/")[1].replace("jpeg", "jpg");
    const file = path.join(dir, `${Date.now()}.${ext}`);
    await writeFile(file, matches[2], "base64");
    console.log(file);
  } catch (ex) {
    console.log("非法 base64 字符串");
  }
};

export default async (src, dir) => {
  // 匹配是否是图片url的正则表达式
  if (/^(https?:\/\/)|\.(jpg|jpeg|png|gif|bmp)$/i.test(src)) {
    await urlToImg(src, dir);
  } else {
    await base64ToImg(src, dir);
  }
};
