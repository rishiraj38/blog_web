import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const reactionRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    my_db: string;
  };
  Variables: {
    userId: string;
  };
}>();


reactionRouter.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }
  try {
    const payload = await verify(jwt, c.env.JWT_SECRET);
    c.set("userId", payload.id as string);
    await next();
  } catch {
    c.status(401);
    return c.json({ error: "Invalid token" });
  }
});


reactionRouter.post("/:postId", async (c) => {
  const userId = c.get("userId");
  const { postId } = c.req.param();
  const { type } = await c.req.json(); 

  if (!["like", "dislike"].includes(type)) {
    c.status(400);
    return c.json({ message: "Invalid reaction type" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.my_db,
  }).$extends(withAccelerate());

  const existing = await prisma.postReaction.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  let reaction;
  if (existing) {
    if (existing.type === type) {
      await prisma.postReaction.delete({ where: { id: existing.id } });
      return c.json({ message: "Reaction removed" });
    } else {
      reaction = await prisma.postReaction.update({
        where: { id: existing.id },
        data: { type },
      });
    }
  } else {
    reaction = await prisma.postReaction.create({
      data: {
        userId,
        postId,
        type,
      },
    });
  }

  return c.json({ message: "Reaction updated", reaction });
});

reactionRouter.get("/:postId", async (c) => {
  const { postId } = c.req.param();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.my_db,
  }).$extends(withAccelerate());

  const [likes, dislikes] = await Promise.all([
    prisma.postReaction.count({ where: { postId, type: "like" } }),
    prisma.postReaction.count({ where: { postId, type: "dislike" } }),
  ]);

  return c.json({ postId, likes, dislikes });
});
