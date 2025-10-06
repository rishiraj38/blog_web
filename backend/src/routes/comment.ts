import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const commentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    my_db: string;
  };
  Variables: {
    userId: string;
  };
}>();


commentRouter.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  try {
    const payload = await verify(jwt, c.env.JWT_SECRET);
    if (!payload) throw new Error("Invalid token");

    c.set("userId", payload.id as string);
    await next();
  } catch (e) {
    c.status(401);
    return c.json({ error: "Invalid token" });
  }
});


commentRouter.post("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.my_db,
  }).$extends(withAccelerate());

  const { postId, content } = await c.req.json();

  if (!postId || !content) {
    c.status(400);
    return c.json({ error: "postId and content are required" });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId,
    },
  });

  return c.json(comment);
});


commentRouter.get("/:postId", async (c) => {
  const postId = c.req.param("postId");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.my_db,
  }).$extends(withAccelerate());

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return c.json(comments);
});
