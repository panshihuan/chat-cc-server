import express from "express";
const router = express.Router();
import db from "../db/commodity.js";
import goods from "../data/goods.js";

// 查询商品列表
router.get("/getList", function (req, res, next) {
  // 获取页数和每页记录数
  const page = req.query.pageIndex || 1;
  const pageSize = req.query.pageSize || 100;
  // 计算偏移量
  const offset = (page - 1) * pageSize;
  // 构建分页查询语句
  const sql = `SELECT * FROM goods LIMIT ${pageSize} OFFSET ${offset}`;
  // 执行查询
  db.query(sql, (err, result) => {
    if (err) {
      // 处理错误
      return res.status(500).json({
        status: 500,
        error: err.message,
        msg: "Internal Server Error",
      });
    }
    result = result.map(item => {
      item.allImgUrl = JSON.parse(item.allImgUrl);
      return item
    })
    // 返回查询结果
    res.json({
      status: 200,
      data: {
        list: result
      },
      msg: "ok",
    });
  });
});



// 查询商品详情
router.get("/getDetail", function (req, res, next) {
  // 获取商品id
  const id = req.query.id;
  // 构建查询语句
  const sql = `SELECT * FROM goods WHERE id = ${id}`;
  // 执行查询
  db.query(sql, (err, result) => {
    if (err) {
      // 处理错误
      return res.status(500).json({
        status: 500,
        error: err.message,
        msg: "Internal Server Error",
      });
    }
    // 返回查询结果
    if (result?.length && result[0]?.allImgUrl?.length) {
      result[0].allImgUrl = JSON.parse(result[0].allImgUrl)
    }
    res.json({
      status: 200,
      data: result[0],
      msg: "ok",
    });
  });
})


export default {
  router,
  name: 'commodity'
};