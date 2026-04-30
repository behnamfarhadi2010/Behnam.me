import { Router, type IRouter } from "express";
import { sql, desc } from "drizzle-orm";
import { db, postsTable, notesTable, projectsTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetRecentActivityResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/dashboard/summary", requireAuth, async (_req, res): Promise<void> => {
  const [posts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where ${postsTable.published} = true)::int`,
    })
    .from(postsTable);
  const [notes] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where ${notesTable.published} = true)::int`,
    })
    .from(notesTable);
  const [projects] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where ${projectsTable.published} = true)::int`,
    })
    .from(projectsTable);

  res.json(
    GetDashboardSummaryResponse.parse({
      postsTotal: posts?.total ?? 0,
      postsPublished: posts?.published ?? 0,
      notesTotal: notes?.total ?? 0,
      notesPublished: notes?.published ?? 0,
      projectsTotal: projects?.total ?? 0,
      projectsPublished: projects?.published ?? 0,
    }),
  );
});

router.get("/dashboard/recent", requireAuth, async (_req, res): Promise<void> => {
  const [posts, notes, projects] = await Promise.all([
    db
      .select({
        id: postsTable.id,
        title: postsTable.title,
        slug: postsTable.slug,
        published: postsTable.published,
        updatedAt: postsTable.updatedAt,
      })
      .from(postsTable)
      .orderBy(desc(postsTable.updatedAt))
      .limit(10),
    db
      .select({
        id: notesTable.id,
        title: notesTable.title,
        slug: notesTable.slug,
        published: notesTable.published,
        updatedAt: notesTable.updatedAt,
      })
      .from(notesTable)
      .orderBy(desc(notesTable.updatedAt))
      .limit(10),
    db
      .select({
        id: projectsTable.id,
        title: projectsTable.title,
        published: projectsTable.published,
        updatedAt: projectsTable.updatedAt,
      })
      .from(projectsTable)
      .orderBy(desc(projectsTable.updatedAt))
      .limit(10),
  ]);

  const items = [
    ...posts.map((p) => ({
      kind: "post" as const,
      id: p.id,
      title: p.title,
      slug: p.slug,
      published: p.published,
      updatedAt: p.updatedAt,
    })),
    ...notes.map((n) => ({
      kind: "note" as const,
      id: n.id,
      title: n.title,
      slug: n.slug,
      published: n.published,
      updatedAt: n.updatedAt,
    })),
    ...projects.map((p) => ({
      kind: "project" as const,
      id: p.id,
      title: p.title,
      slug: null,
      published: p.published,
      updatedAt: p.updatedAt,
    })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 15);

  res.json(GetRecentActivityResponse.parse(items));
});

export default router;
