import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, notesTable } from "@workspace/db";
import {
  CreateNoteBody,
  GetNoteParams,
  GetNoteResponse,
  UpdateNoteParams,
  UpdateNoteBody,
  UpdateNoteResponse,
  DeleteNoteParams,
  ListNotesResponse,
  ListNotesQueryParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/notes", async (req, res): Promise<void> => {
  const params = ListNotesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const rows =
    params.data.published === undefined
      ? await db.select().from(notesTable).orderBy(desc(notesTable.createdAt))
      : await db
          .select()
          .from(notesTable)
          .where(eq(notesTable.published, params.data.published))
          .orderBy(desc(notesTable.createdAt));
  res.json(ListNotesResponse.parse(rows));
});

router.post("/notes", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(notesTable).values(parsed.data).returning();
  res.status(201).json(GetNoteResponse.parse(row));
});

router.get("/notes/:slug", async (req, res): Promise<void> => {
  const params = GetNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.slug, params.data.slug));
  if (!row) {
    res.status(404).json({ error: "Note not found" });
    return;
  }
  res.json(GetNoteResponse.parse(row));
});

router.put("/notes/id/:id", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .update(notesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(notesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Note not found" });
    return;
  }
  res.json(UpdateNoteResponse.parse(row));
});

router.delete("/notes/id/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .delete(notesTable)
    .where(eq(notesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Note not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
