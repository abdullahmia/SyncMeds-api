import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import userService from "./user.service";

export class UserController {
  constructor() {}

  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getUsers();
    return res
      .status(httpStatus.OK)
      .send(response(httpStatus.OK, "User lists", users));
  }
}

export default new UserController();
