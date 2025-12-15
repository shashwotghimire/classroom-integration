import { Request, Response } from "express";
import { google } from "googleapis";
import { getOAuth2Client, getAuthUrl } from "../integrations/oauth.client";
import { prisma } from "../utils/prisma.utils";

export const startGoogleOAuth = (req: Request, res: Response) => {
  const authUrl = getAuthUrl();

  return res.json({
    success: true,
    message: "Visit this url to authorize google classroom",
    data: { authUrl },
  });
};

export const googleOAuthCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({
        error: "No authorization code provided",
      });
    }

    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    if (!data.email || !data.id) {
      return res.status(400).json({
        error: "Unable to retrieve Google user information",
      });
    }
    const email = data.email;
    const googleId = data.id;
    const schoolDomain = email.split("@")[1] ?? null;

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        googleId,
        firstName: data.given_name ?? "",
        lastName: data.family_name ?? "",
        schoolDomain,
      },
      update: {
        googleId,
        firstName: data.given_name ?? "",
        lastName: data.family_name ?? "",
      },
    });

    await prisma.googleToken.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token ?? null,
        expiresAt: new Date(tokens.expiry_date!),
        scope: tokens.scope!,
      },
      update: {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token ?? null,
        expiresAt: new Date(tokens.expiry_date!),
        scope: tokens.scope!,
      },
    });

    return res.json({
      success: true,
      message: "Authorization successful!",
      user: {
        id: user.id,
        email: user.email,
        schoolDomain: user.schoolDomain,
      },
    });
  } catch (error: any) {
    console.error("Google OAuth callback error:", error);
    return res.status(500).json({
      error: "Google OAuth failed",
      details: error.message,
    });
  }
};
