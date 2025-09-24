import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { signupInput, signinInput } from "@rishi438/zod";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    my_db: string;
  };
  Variables: {
    userId: string; 
  };
}>();


userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.my_db }).$extends(
    withAccelerate()
  );
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs are incorrect" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password, 
        name: body.name,
      },
    });

    const jwt = await sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      c.env.JWT_SECRET
    );

    return c.text(jwt);
  } catch (e) {
    console.error(e);
    c.status(403);
    return c.json({ error: "Error while signing up" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.my_db }).$extends(
    withAccelerate()
  );
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs are incorrect" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: body.email, password: body.password },
    });

    if (!user) {
      c.status(403);
      return c.json({ message: "Incorrect credentials" });
    }

    const jwt = await sign(
      { id: user.id, email: user.email, name: user.name },
      c.env.JWT_SECRET
    );

    return c.json(jwt);
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ message: "Something went wrong" });
  }
});

userRouter.use(async (c, next) => {
  const token = c.req.header("Authorization");
  if (!token) {
    c.status(401);
    return c.json({ message: "No token provided" });
  }

  try {
    const payload = (await verify(token, c.env.JWT_SECRET)) as { id: string };
    if (!payload?.id) throw new Error("Invalid token");

    c.set("userId", payload.id);
    await next();
  } catch (e) {
    console.error(e);
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
});

userRouter.put("/profile", async (c) => {
  const userId = c.get("userId");
  if (!userId) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.my_db }).$extends(
    withAccelerate()
  );
  const { name, email } = await c.req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: { id: true, name: true, email: true },
    });

    return c.json({ message: "Profile updated", user: updatedUser });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ error: "Could not update profile" });
  }
});

userRouter.put("/profile/password", async (c) => {
  const userId = c.get("userId");
  if (!userId) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.my_db }).$extends(
    withAccelerate()
  );
  const { oldPassword, newPassword } = await c.req.json();

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.password !== oldPassword) {
      c.status(403);
      return c.json({ error: "Old password is incorrect" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });

    return c.json({ message: "Password updated successfully" });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ error: "Could not update password" });
  }
});