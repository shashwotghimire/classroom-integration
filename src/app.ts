import express from "express";
import googleAuthRoutes from "./routes/oauth.routes";

const app = express();
app.use(express.json());

app.use("/api", googleAuthRoutes);

export default app;
