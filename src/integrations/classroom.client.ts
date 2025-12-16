import { prisma } from "../utils/prisma.utils";
import { getClassroomClientForUser, getOAuth2Client } from "./oauth.client";
import { google } from "googleapis";

export const getClassroomClient = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { googleTokens: true },
  });
  if (!user?.googleTokens) {
    throw new Error("Google classroom not connected");
  }

  const { accessToken, refreshToken, expiresAt } = user.googleTokens;
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: expiresAt.getTime(),
  });
  return google.classroom({ version: "v1", auth: oauth2Client });
};
