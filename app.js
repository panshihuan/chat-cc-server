import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import logger from './logger.js';
import expressjwt from "express-jwt";
import { secretKey, } from './config.js'

import indexRouter from './routes/index.js';
import usersRouter from './routes/user.js';
import chatRouter from './routes/chat.js';
import commodityRouter from './routes/commodity.js';
import crawlRouter from './routes/crawl.js';


// 兼容dirname,解决import引入的问题
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
// __filename作为全局变量使用
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
global.__filename = __filename;
global.__dirname = __dirname;

var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 配置成功后，就可以使用req.user来获取倒数据了
// .unless({ path: [/^\/api\//] })  表示哪些接口不需要访问权限
app.use(expressjwt({ secret: secretKey }).unless({ path: [/\/api\//] }));

// 读取routes文件夹中的文件列表
// const routeFiles = fs.readdirSync('./routes');
// // 遍历文件列表
// routeFiles.forEach(async (file) => {
//   // 动态导入每个文件
//   const route = await import(`./routes/${file}`);
//   // 将路由添加到app中
//   const routerName = `/${route.default.name || ''}`
//   console.log(3333, routerName, route.default.router)
//   app.use(routerName, route.default.router);
// });

app.use('/', indexRouter.router);
app.use('/user', usersRouter.router);
app.use('/chat', chatRouter.router);
app.use('/crawl', crawlRouter.router);
app.use('/commodity', commodityRouter.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

const _errorHandler = (err, req, res, next) => {
  console.log(444444, err)
  logger.error(`${req.method} ${req.originalUrl} ` + err.message)
  const errorMsg = err.message
  res.status(err.status || 500).json({
    code: -1,
    success: false,
    message: errorMsg,
    data: {}
  })
}
app.use(_errorHandler)

export default app;
