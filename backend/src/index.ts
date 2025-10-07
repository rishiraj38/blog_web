import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { cors } from "hono/cors";
import { commentRouter } from "./routes/comment";
import { reactionRouter } from "./routes/reaction";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
app.use('/*',cors())
app.route("/api/v1/user",userRouter)
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/comment", commentRouter); 
app.route("/api/v1/reaction", reactionRouter);




export default app;
