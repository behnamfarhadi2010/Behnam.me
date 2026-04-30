import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, aboutTable } from "@workspace/db";
import {
  GetAboutResponse,
  UpdateAboutBody,
  UpdateAboutResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const DEFAULT_ABOUT = {
  name: "Your Name",
  tagline: "Software engineer and creator",
  intro: "Welcome to my personal corner of the internet.",
  bio: "Tell your story here. You can edit this from the dashboard.",
  emailNewsletter: "",
  blueskyUrl: "",
  rssUrl: "",
};

async function ensureAboutRow() {
  const [row] = await db.select().from(aboutTable).limit(1);
  if (row) return row;
  const [created] = await db.insert(aboutTable).values(DEFAULT_ABOUT).returning();
  return created;
}

router.get("/about", async (_req, res): Promise<void> => {
  const row = await ensureAboutRow();
  res.json(GetAboutResponse.parse(row));
});

router.put("/about", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateAboutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existing = await ensureAboutRow();
  const [row] = await db
    .update(aboutTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(aboutTable.id, existing.id))
    .returning();
  res.json(UpdateAboutResponse.parse(row));
});

export default router;
