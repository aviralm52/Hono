import { Hono } from "hono";
import app from "./routes/personRoutes";

// const app = new Hono();

app.route("/", app);

export default app;
