import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@rishi438/zod";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    my_db: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  const payload = await verify(jwt, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  c.set("userId", payload.id as string);
  await next();
});

blogRouter.post("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.my_db,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs are incorrect" });
  }

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      imageUrl: body.imageUrl,
      authorId: userId,
    },
  });

  return c.json({ id: post.id });
});

blogRouter.put("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.my_db,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs are incorrect" });
  }

  await prisma.post.update({
    where: {
      id: body.id,
      authorId: userId,
    },
    data: {
      title: body.title,
      content: body.content,
      imageUrl: body.imageUrl, 
    },
  });

  return c.text("updated post");
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.my_db,
  }).$extends(withAccelerate());


  const blogs = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true, 
      createdAt: true,
      author: { select: { name: true, avatar: true } }, 
      comments: true, 
      reactions: { select: { type: true } }, 
    },
  });

  const formattedBlogs = blogs.map((post) => {
    const likeCount = post.reactions.filter((r) => r.type === "like").length;
    const dislikeCount = post.reactions.filter(
      (r) => r.type === "dislike"
    ).length;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl, 
      createdAt: post.createdAt,
      author: post.author,
      commentCount: post.comments.length,
      reactionCounts: {
        likes: likeCount,
        dislikes: dislikeCount,
      },
    };
  });

  return c.json({ blogs: formattedBlogs });
});


blogRouter.get("/filter", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.my_db,
  }).$extends(withAccelerate());

  const blogs = await prisma.post.findMany({
    where: { authorId: userId },
    select: {
      content: true,
      title: true,
      id: true,
      imageUrl: true, 
      authorId: true,
      createdAt: true,
      author: { select: { name: true, avatar: true } }, 
    },
  });

  return c.json({ blogs });
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.my_db,
  }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true, 
      createdAt: true,
      author: { select: { name: true, avatar: true } },
      comments: true,
      reactions: { select: { type: true } },
    },
  });

  if (!post) {
    c.status(404);
    return c.json({ message: "Post not found" });
  }

  const likeCount = post.reactions.filter((r) => r.type === "like").length;
  const dislikeCount = post.reactions.filter(
    (r) => r.type === "dislike"
  ).length;

  return c.json({
    ...post,
    likeCount,
    dislikeCount,
    commentCount: post.comments.length,
  });
});

blogRouter.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const prisma = new PrismaClient({ datasourceUrl: c.env.my_db }).$extends(
    withAccelerate()
  );

  try {
    const deletedPost = await prisma.post.deleteMany({
      where: { id, authorId: userId },
    });

    if (deletedPost.count === 0) {
      c.status(404);
      return c.json({ message: "Post not found or unauthorized" });
    }

    return c.json({ message: "Post deleted" });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Something went wrong" });
  }
});
