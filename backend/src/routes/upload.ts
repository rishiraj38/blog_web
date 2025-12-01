import { Hono } from "hono";
import { verify } from "hono/jwt";

export const uploadRouter = new Hono<{
  Bindings: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Authentication middleware
uploadRouter.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }

  try {
    const payload = await verify(jwt, c.env.JWT_SECRET);
    if (!payload) {
      c.status(401);
      return c.json({ error: "unauthorized" });
    }
    c.set("userId", payload.id as string);
    await next();
  } catch (e) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
});

// POST /api/v1/upload - Protected route for image uploads
uploadRouter.post("/", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"];

    if (!file || !(file instanceof File)) {
      c.status(400);
      return c.json({ error: "No file uploaded" });
    }

    const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
    
    // Generate signature and upload to Cloudinary
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const stringToSign = `timestamp=${timestamp}${c.env.CLOUDINARY_API_SECRET}`;
    
    const signature = await crypto.subtle.digest(
      "SHA-1",
      new TextEncoder().encode(stringToSign)
    ).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", c.env.CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json() as any;

    if (!response.ok) {
        console.error("Cloudinary error:", data);
        c.status(500);
        return c.json({ error: "Image upload failed", details: data });
    }

    return c.json({ url: data.secure_url });
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ error: "Something went wrong during upload" });
  }
});
