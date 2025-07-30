import { db } from "@/core/database/prisma.client";
import { Prisma, Settings } from "@/generated/prisma";
import { ApiError } from "@/shared/utils/api-error.util";
import httpStatus from "http-status";

export const getSettings = async (): Promise<Settings | null> => {
  try {
    const settings = await db.settings.findFirst();
    return settings;
  } catch {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve settings"
    );
  }
};

export const updateSettings = async (
  id: string,
  payload: Partial<Settings>
): Promise<Settings> => {
  try {
    const settings = await db.settings.update({
      where: {
        settings_id: id,
      },
      data: payload,
    });

    return settings;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new ApiError(404, "Settings not found");
      }
    }
    throw new ApiError(500, "Failed to update settings");
  }
};
