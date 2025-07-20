import config from "@/config";
import { getUserById } from "@/modules/user/user.repository";
import { UserPayload } from "@/modules/user/user.types";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
  algorithms: ["HS256"],
};

export const jwtStrategy = new JwtStrategy(
  options,
  async (payload: UserPayload, done) => {
    try {
      const user = await getUserById(payload.id);

      if (!user) return done(null, false, { message: "User not found!" });

      const userPayload: UserPayload = {
        id: user.user_id,
        email: user.email,
        name: user.name,
      };

      return done(null, userPayload);
    } catch (error) {
      return done(error, false);
    }
  }
);
