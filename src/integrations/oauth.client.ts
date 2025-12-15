import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
};

export const getAuthUrl = () => {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/classroom.courses",
      "https://www.googleapis.com/auth/classroom.rosters.readonly",
      "https://www.googleapis.com/auth/classroom.coursework.students",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    prompt: "consent",
  });
};

export const getClassroomClientForUser = async (
  accessToken: string,
  refreshToken?: string | null,
  expiresAt?: Date
) => {
  const oauth2Client = getOAuth2Client();

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken ?? null,
    expiry_date: expiresAt ? expiresAt.getTime() : null,
  });

  return google.classroom({
    version: "v1",
    auth: oauth2Client,
  });
};
