import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

export const protectRoute: Middleware = async (ctx, next) => {
  if (ctx.isUnauthenticated()) {
    ctx.status = StatusCodes.UNAUTHORIZED;
    return;
  }
  return await next();
};
