import { getUserById } from "@/modules/user/user.repository";
import { UserPayload } from "@/modules/user/user.types";
import passport from "passport";
import { jwtStrategy } from "./strategies/jwt.strategy";
import { localStrategy } from "./strategies/local.strategy";

export const configurePassport = (): void => {
  passport.use("local", localStrategy);
  passport.use("jwt", jwtStrategy);

  // Serialize user for session (not used in JWT setup, but required by Passport)
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session (not used in JWT setup, but required by Passport)
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await getUserById(id);

      if (user) {
        const userPayload: UserPayload = {
          id: user.user_id,
          email: user.email,
          name: user.name,
        };
        done(null, userPayload);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, null);
    }
  });
};

export default passport;
