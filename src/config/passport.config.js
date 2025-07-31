import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:6500/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email provided by Google"), null);
        }

        const user = await prisma.user.upsert({
          where: { email: email },
          update: {
            googleId: profile.id,
            name: profile.displayName,
            emailVerified: true,
            avatarUrl: profile.photos?.[0]?.value,
          },
          create: {
            email: email,
            googleId: profile.id,
            name: profile.displayName,
            emailVerified: true,
            avatarUrl: profile.photos?.[0]?.value,
          },
        });

        return done(null, user);
      } catch (error) {
        console.error("Google OAuth error", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
