import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { signupInput, signinInput } from "@rishi438/zod";
import bcrypt from "bcryptjs";

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
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
      },
    });

    const jwt = await sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      c.env.JWT_SECRET
    );

    c.header("Authorization", jwt);
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
      where: { email: body.email },
    });

    if (!user) {
      c.status(403);
      return c.json({ message: "Incorrect credentials" });
    }

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
      c.status(403);
      return c.json({ message: "Incorrect credentials" });
    }

    const jwt = await sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      },
      c.env.JWT_SECRET
    );

    c.header("Authorization", jwt);
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
      select: { id: true, name: true, email: true, avatar: true },
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

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found" });
    }

    const oldMatch = await bcrypt.compare(oldPassword, user.password);
    if (!oldMatch) {
      c.status(403);
      return c.json({ error: "Old password is incorrect" });
    }

    const newHashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: newHashed },
    });

    return c.json({ message: "Password updated successfully" });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ error: "Could not update password" });
  }
});
