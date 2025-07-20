import { getUserByEmail } from "@/modules/user/user.repository";
import { UserPayload } from "@/modules/user/user.types";
import { Strategy as LocalStrategy } from "passport-local";
import { comparePassword } from "../password.service";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email: string, password: string, done) => {
    try {
      const user = await getUserByEmail(email);
      if (!user) return done(null, false, { message: "Invalid credentials" });

      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword)
        return done(null, false, { message: "Invalid credentials" });

      const userPayload: UserPayload = {
        id: user.user_id,
        email: user.email,
        name: user.name,
      };

      return done(null, userPayload);
    } catch (error) {
      return done(error);
    }
  }
);
