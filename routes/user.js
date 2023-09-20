import express from "express";
var router = express.Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { secretKey, expiresIn } from "../config.js";
import db from "../db/index.js";

// 注册
router.post("/api/register", function (req, res, next) {
  // 加密密码
  const password = bcrypt.hashSync(req.body.password, 10);
  const phone = req.body.phone || "";
  try {
    const sql = `INSERT INTO user (userId, username, password, phone, nickname, gender) 
    SELECT ?, ?, ?, ?, ?, ?
    WHERE NOT EXISTS (
        SELECT * FROM user WHERE username = '${req.body.username}' OR phone = '${phone}')`;
    const userId =
      Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    const values = [
      userId,
      req.body.username || null,
      password,
      req.body.phone || null,
      req.body.nickname || null,
      req.body.gender || null,
    ];
    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          error: err.message,
          msg: "Internal Server Error",
        });
      }
      if (result.affectedRows <= 0) {
        return res.status(200).json({
          status: 200,
          data: {
            msg: "已存在该用户",
            code: -1,
            status: 0,
          },
        });
      }
      if (result.affectedRows !== 1) {
        return res.status(500).json({
          status: 500,
          error: "Failed to insert user",
          msg: "Internal Server Error",
        });
      }
      res.json({
        status: 200,
        data: {
          msg: "注册成功",
          code: 0,
        },
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
      msg: "Internal Server Error",
    });
  }
});

// 登录
router.post("/api/login", function (req, res, next) {
  // 判断用户是否存在
  db.query(
    "SELECT * FROM user WHERE username = ?",
    [req.body.username],
    (err, results) => {
      console.log(111999, err, results)
      if (err) {
        return res.status(500).json({
          status: 500,
          error: err.message,
          msg: "Internal Server Error",
        });
      }
      if (results.length !== 1) {
        return res.status(200).json({
          status: 200,
          data: {
            msg: "没有该用户",
            code: -1,
            status: 0,
          },
        });
      }
      // 判断密码是否正确（密码是加过密的）, 解密 bcrypt.compareSync
      const compareResult = bcrypt.compareSync(
        req.body.password,
        results[0].password
      );
      if (!compareResult) {
        return res.status(200).json({
          status: 200,
          data: {
            msg: "用户名或密码错误",
            code: -1,
            status: 0,
          },
        });
      }

      const userInfo = {
        username: results[0].username,
        phone: results[0].phone,
      };
      // jwt生成token
      const tokenStr = jwt.sign(userInfo, secretKey, {
        expiresIn,
      });
      res.send({
        status: 200,
        msg: "登录成功",
        data: {
          token: tokenStr,
        },
      });
    }
  );
});

// 获取用户信息
router.get("/getUserInfo", (req, res) => {
  console.log(5555, req.user);
  res.send({
    status: 200,
    msg: "获取用户信息成功",
    data: req.user,
  });
});

export default {
  router,
  name: "user",
};
