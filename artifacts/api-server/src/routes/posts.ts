import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";
import {
  CreatePostBody,
  GetPostParams,
  GetPostResponse,
  UpdatePostParams,
  UpdatePostBody,
  UpdatePostResponse,
  DeletePostParams,
  ListPostsResponse,
  ListPostsQueryParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/posts", async (req, res): Promise<void> => {
  const params = ListPostsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows =
    params.data.published === undefined
      ? await db.select().from(postsTable).orderBy(desc(postsTable.createdAt))
      : await db
          .select()
          .from(postsTable)
          .where(eq(postsTable.published, params.data.published))
          .orderBy(desc(postsTable.createdAt));

  res.json(ListPostsResponse.parse(rows));
});

router.post("/posts", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(postsTable).values(parsed.data).returning();
  res.status(201).json(GetPostResponse.parse(row));
});

router.get("/posts/:slug", async (req, res): Promise<void> => {
  const params = GetPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.slug, params.data.slug));
  if (!row) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(GetPostResponse.parse(row));
});

router.put("/posts/id/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdatePostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .update(postsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(postsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(UpdatePostResponse.parse(row));
});

router.delete("/posts/id/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeletePostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(postsTable)
    .where(eq(postsTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
