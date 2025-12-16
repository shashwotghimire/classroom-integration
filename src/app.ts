import express from "express";
import googleAuthRoutes from "./routes/oauth.routes";
import courseRoutes from "./routes/course.routes";
import { errorHandler } from "./middleware/error.middleware";
const app = express();
app.use(express.json());

app.use("/api/auth", googleAuthRoutes);
app.use("/api", courseRoutes);

app.use(errorHandler);
export default app;
