import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@rishi438/zod";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    my_db:string;
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
//   const token = jwt.split(" ")[1];
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
    datasourceUrl:c.env.my_db,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const {success} = createBlogInput.safeParse(body)
    if(!success){
      c.status(411)
      return c.json({
          message:"Inputs are incorrect"
      })
    }
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
    },
  });
  return c.json({
    id: post.id,
  });
});

blogRouter.put("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl:c.env.my_db,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const {success} = updateBlogInput.safeParse(body)
    if(!success){
      c.status(411)
      return c.json({
          message:"Inputs are incorrect"
      })
    }
  prisma.post.update({
    where: {
      id: body.id,
      authorId: userId,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.text("updated post");
});

blogRouter.get('/bulk',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl:c.env.my_db,
    }).$extends(withAccelerate());
    const blogs = await prisma.post.findMany();

    return c.json({
        blogs
    })
})

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl:c.env.my_db,
  }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  return c.json(post);
});
