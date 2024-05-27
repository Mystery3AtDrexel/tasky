import * as Router from '@koa/router';
import { db } from 'src/db';
import * as schema from '../db/schema';
import { StatusCodes } from 'http-status-codes';
import { protectRoute } from 'src/utils/middlewares';
import { and, eq, getTableColumns, gte, lt } from 'drizzle-orm';
import * as qs from 'qs';

export const taskRouter = new Router().use(protectRoute);

taskRouter.get('/', async (ctx) => {
  const queryParams = qs.parse(ctx.querystring ?? '');
  const filters = [eq(schema.tasks.userId, ctx.state.user.id)];

  const tableFilters = Object.entries(queryParams).filter(
    ([column, filter]) =>
      column in Object.keys(getTableColumns(schema.tasks)) && filter,
  );

  for (const [column, filter] of tableFilters) {
    if (!filter || typeof filter !== 'object') continue;
    if (filter['gte'] !== undefined) {
      filters.push(gte(schema.tasks[column], filter['gte']));
    }
    if (filter['lt'] !== undefined) {
      filters.push(lt(schema.tasks[column], filter['lt']));
    }
  }

  const tasks = await db.query.tasks.findMany({
    where: and(...filters),
    orderBy: (tasks, { asc }) => [asc(tasks.date)],
  });
  ctx.body = { tasks };
});

taskRouter.post('/', async (ctx) => {
  const insertTask = await schema.insertTaskSchema
    .parseAsync(ctx.request.body)
    .catch((e) => ctx.throw(StatusCodes.BAD_REQUEST, e.message));
  if (insertTask.userId !== ctx.state.user.id) ctx.throw(StatusCodes.FORBIDDEN);

  const tasks = await db
    .insert(schema.tasks)
    .values(insertTask)
    .returning()
    .catch(() => ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR));

  ctx.body = {
    task: tasks[0],
  };
});

taskRouter.patch('/:taskId', async (ctx) => {
  const taskId = Number(ctx.params.taskId);
  const userId = ctx.state.user.id;
  const taskUpdates = await schema.updateTaskSchema
    .parseAsync(ctx.request.body)
    .catch(() => ctx.throw(StatusCodes.BAD_REQUEST));

  const task = await db.query.tasks.findFirst({
    where: (tasks, { eq }) => eq(tasks.id, taskId),
  });
  if (task?.userId !== userId) ctx.throw(StatusCodes.FORBIDDEN);

  const updatedTask = await db
    .update(schema.tasks)
    .set(taskUpdates)
    .where(eq(schema.tasks.id, taskId))
    .returning()
    .catch(() => ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR));

  ctx.body = {
    task: updatedTask[0],
  };
});

taskRouter.delete('/:taskId', async (ctx) => {
  const taskId = Number(ctx.params.taskId);
  const userId = ctx.state.user.id;

  const task = await db.query.tasks.findFirst({
    where: (tasks, { eq }) => eq(tasks.userId, userId),
  });
  if (!task) ctx.throw(StatusCodes.FORBIDDEN);

  const deletedTasks = await db
    .delete(schema.tasks)
    .where(eq(schema.tasks.id, taskId))
    .returning();
  if (!deletedTasks[0]) ctx.throw(StatusCodes.INTERNAL_SERVER_ERROR);

  ctx.body = {
    task: deletedTasks[0],
  };
});
