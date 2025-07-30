import { response } from "@/shared/utils/api-response.util";
import { Request, Response } from "express";
import httpStatus from "http-status";
import * as settingsService from "./settings.service";

export const getSettings = async (req: Request, res: Response) => {
  const settings = await settingsService.getSettings();
  return res
    .status(httpStatus.OK)
    .send(response(httpStatus.OK, "Settings retrieved successfully", settings));
};

export const updateSettings = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const updatedSettings = await settingsService.updateSettings(id, payload);
  return res
    .status(httpStatus.OK)
    .send(
      response(httpStatus.OK, "Settings updated successfully", updatedSettings)
    );
};
