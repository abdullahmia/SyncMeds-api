import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import * as userService from "./user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "User lists", users));
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "User by id", user));
};

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  return res
    .status(httpStatus.CREATED)
    .send(response(httpStatus.OK, "User has been created", user));
};

export const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userService.updateUser(id, req.body);
  return res
    .status(httpStatus.CREATED)
    .send(response(httpStatus.OK, "User has been updated", user));
};

export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userService.deleteUser(id);
  return res
    .status(httpStatus.CREATED)
    .send(response(httpStatus.OK, "User has been deleted", user));
};
