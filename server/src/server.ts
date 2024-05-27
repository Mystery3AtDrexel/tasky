// eslint-disable-next-line  @typescript-eslint/no-explicit-any
import 'module-alias/register';
import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as Router from '@koa/router';
import * as bodyParser from 'koa-bodyparser';
import * as session from 'koa-session';
import * as passport from 'koa-passport';
import * as cors from '@koa/cors';
import { authRouter } from './routes/auth';
import { taskRouter } from './routes/task';

const CLIENT_URL = process.env.CLIENT_URL;
const SERVER_PORT = process.env.SERVER_PORT ?? 8080;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

const server = new Koa();
if (!COOKIE_SECRET) throw Error('COOKIE_SECRET not provided');
server.keys = [COOKIE_SECRET];
const router = new Router({ prefix: '/api' });

// logger
if (process.env.NODE_ENV !== 'prod') {
  server.use(logger());
}

router.get('/status', async (ctx) => {
  ctx.body = { status: 'OK' };
});

router.use('/auth', authRouter.routes(), authRouter.allowedMethods());
router.use('/tasks', taskRouter.routes(), taskRouter.allowedMethods());

server
  .use(
    cors({
      origin: CLIENT_URL,
      allowHeaders: 'Content-Type',
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      keepHeadersOnError: true,
      credentials: true,
    }),
  )
  .use(session(server))
  .use(bodyParser())
  .use(passport.initialize())
  .use(passport.session())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(SERVER_PORT, () => {
    console.log(`Server started at http://localhost:${SERVER_PORT}/`);
  });
