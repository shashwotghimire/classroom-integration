import { Router } from "express";
import {
  startGoogleOAuth,
  googleOAuthCallback,
} from "../controllers/oauth.controller";

const router = Router();

router.get("/auth/google", startGoogleOAuth);

router.get("/auth/google/callback", googleOAuthCallback);

export default router;
