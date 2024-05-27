import * as Router from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import * as passport from 'koa-passport';
import * as GoogleStategy from 'passport-google-oidc';
import { db } from 'src/db';
import * as schema from 'src/db/schema';
import { protectRoute } from 'src/utils/middlewares';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

type GoogleProfile = {
  id: string;
  displayName: string;
};

const verifyGoogleStrategy = async (
  issuer: string,
  profile: GoogleProfile,
  callback: (error: Error | null, userData?: unknown) => void,
) => {
  try {
    let account = await db.query.accounts.findFirst({
      with: { user: true },
      where: (records, { eq, and }) =>
        and(eq(records.provider, issuer), eq(records.subject, profile.id)),
    });
    if (!account) {
      const insertedUsers = await db
        .insert(schema.users)
        .values({ name: profile.displayName })
        .returning();
      const insertedAccounts = await db.insert(schema.accounts).values({
        provider: issuer,
        subject: profile.id,
        userId: insertedUsers[0].id,
      });
      account = { ...insertedAccounts[0], user: insertedUsers[0] };
    }
    const userData = account?.user && {
      id: account.user.id.toString(),
      name: account.user.name,
    };
    callback(null, userData);
  } catch (e) {
    callback(e as Error);
  }
};

passport.use(
  new GoogleStategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/oauth2/redirect/google',
      scope: ['profile'],
    },
    verifyGoogleStrategy,
  ),
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, { ...user, id: Number(user['id']) }));
});

passport.deserializeUser((user: Express.User, cb) => {
  process.nextTick(() => cb(null, { ...user, id: Number(user['id']) }));
});

export const authRouter = new Router();

authRouter.get('/google', passport.authenticate('google'));

authRouter.get(
  '/oauth2/redirect/google',
  passport.authenticate('google', {
    failureRedirect: CLIENT_URL + '/login',
    failureMessage: true,
  }),
  (ctx) => {
    ctx.redirect(CLIENT_URL ?? '');
  },
);

authRouter.get('/auth-state', async (ctx) => {
  ctx.body = {
    isAuthenticated: ctx.isAuthenticated(),
  };
});

authRouter.get('/me', protectRoute, async (ctx) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, ctx.state.user.id),
  });
  ctx.body = { user };
});

authRouter.post('/logout', protectRoute, async (ctx) => {
  await ctx.logout();
  ctx.status = StatusCodes.OK;
});
