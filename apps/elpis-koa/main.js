import Koa from 'koa';
import config from './config/index.js';
import router from './app/router/app.js';

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

// console.log(app.env, config)

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
