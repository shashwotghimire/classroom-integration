import { Router } from "express";
import {
  startGoogleOAuth,
  googleOAuthCallback,
} from "../controllers/oauth.controller";

const router = Router();

router.get("/google", startGoogleOAuth);

router.get("/google/callback", googleOAuthCallback);

export default router;
