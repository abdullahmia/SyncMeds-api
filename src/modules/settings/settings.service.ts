import { Settings } from "@/generated/prisma";
import * as settingsRepository from "./settings.repository";

export const getSettings = async (): Promise<Settings | null> => {
  return await settingsRepository.getSettings();
};

export const updateSettings = async (
  id: string,
  payload: Partial<Settings>
): Promise<Settings> => {
  return await settingsRepository.updateSettings(id, payload);
};
