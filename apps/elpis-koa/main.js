const Koa = require('koa');
const controllers = require('./app/controllers');
const services = require('./app/services');
const router = require('./app/router');
const env = require('./env');
const config = require('./config');
const middlewares = require('./app/middlewares');

const app = new Koa();
env(app);
config(app);
middlewares(app);
services(app);
controllers(app);
router(app);

try {
  const port = process.env.PORT || 8080;
  const host = process.env.IP || '0.0.0.0';
  app.listen(port, host);
  console.info(`${app.env.get()}: http://localhost:${port}`);
} catch (err) {
  console.error(`启动服务失败:`, err);
}
