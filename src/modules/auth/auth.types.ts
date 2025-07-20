import { UserPayload } from "../user/user.types";

export type LoginResponse = {
  access_token: string;
  user: UserPayload;
};
