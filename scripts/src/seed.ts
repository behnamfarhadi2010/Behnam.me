import { db, postsTable, notesTable, projectsTable, aboutTable } from "@workspace/db";

async function main() {
  const [aboutCount] = await db.select().from(aboutTable).limit(1);
  if (!aboutCount) {
    await db.insert(aboutTable).values({
      name: "Behnam Farhadi",
      tagline: "Software engineer & open-source creator",
      intro:
        "Hi, I'm Behnam — a software engineer and open-source creator. I've been building things on the web since the early 2000s and writing about it for the last decade.",
      bio: "I'm a software engineer based in the Bay Area. I love building thoughtful tools, writing about what I learn, and tending to small open-source projects in my spare time. This site is my digital garden — a place to publish notes, share long-form posts, and link to the things I've made. Everything here is written by me, not AI.",
      emailNewsletter: "https://example.com/newsletter",
      blueskyUrl: "https://bsky.app/",
      rssUrl: "/rss.xml",
    });
  }

  const [postCount] = await db.select().from(postsTable).limit(1);
  if (!postCount) {
    await db.insert(postsTable).values([
      {
        slug: "enabling-apache-echarts-in-react",
        title: "Enabling Apache ECharts in React for Data Visualization",
        excerpt:
          "A practical walkthrough of wiring up Apache ECharts inside a modern React app, with sensible defaults for theming and resize handling.",
        content:
          "Apache ECharts is one of the most flexible chart libraries on the web, and pairing it with React unlocks a lot of expressive data visualization with surprisingly little code.\n\nIn this post we'll walk through installation, the minimal wrapper component you'll want to author once, and a few patterns for theming that scale across an app.\n\nThe full source for the examples is in the sample repo linked at the end.",
        published: true,
      },
      {
        slug: "creating-a-keyboard-shortcut-hook-in-react",
        title: "Creating a Keyboard Shortcut Hook in React (Deep Dive)",
        excerpt:
          "Designing a small, type-safe useShortcut hook that handles modifier keys, focus contexts, and cleanup the way you'd expect.",
        content:
          "Keyboard shortcuts are one of those small details that quietly elevate an app. In this deep dive we build a useShortcut hook from scratch — covering modifier handling, contextual focus, and lifecycle cleanup.\n\nBy the end you'll have a tiny utility you can drop into any React project.",
        published: true,
      },
      {
        slug: "html-tables-with-horizontal-scroll-and-sticky-headers",
        title: "HTML Tables with Horizontal Scroll and Sticky Headers",
        excerpt:
          "How to build wide data tables that stay readable on narrow screens, using nothing more than CSS.",
        content:
          "Wide HTML tables are a classic responsive design problem. Here's a no-JavaScript approach using a wrapper element, overflow-x, and position: sticky to keep your headers anchored as users scroll.",
        published: true,
      },
      {
        slug: "how-to-use-websockets-in-redux",
        title: "How to Use WebSockets in a Redux Application",
        excerpt:
          "A pattern for piping WebSocket events into Redux state without spaghetti — middleware, action creators, and reconnection handling.",
        content:
          "WebSockets and Redux can feel awkward together at first. The trick is to treat the socket as a side effect and route incoming messages through middleware. This post walks through the pattern end-to-end.",
        published: true,
      },
      {
        slug: "understanding-the-graphql-type-system",
        title: "Understanding the GraphQL Type System",
        excerpt:
          "An honest tour of GraphQL's type system — scalars, objects, interfaces, unions, and the gotchas that catch most newcomers.",
        content:
          "GraphQL's type system is small but expressive. In this post we cover the building blocks, where teams commonly trip up, and how to evolve a schema gracefully over time.",
        published: true,
      },
    ]);
  }

  const [noteCount] = await db.select().from(notesTable).limit(1);
  if (!noteCount) {
    await db.insert(notesTable).values([
      {
        slug: "year-in-review-2024-into-2025",
        title: "Year in Review: 2024 into 2025",
        excerpt: "A look back at the year — what shipped, what stalled, and what I'm carrying into 2025.",
        content:
          "2024 was a quieter year by design. I focused on a small handful of long-running projects and a lot of writing.\n\nThe headlines: shipped a redesign of this site, published 18 posts, picked up two new open-source projects, and spent a real amount of time outside.\n\nGoing into 2025 I want to write more about what I'm making in real time, not just postmortems.",
        published: true,
      },
      {
        slug: "redesign-version-7",
        title: "Redesign: Version 7.0 — Sidebars, light-dark, and Bluesky",
        excerpt: "Notes from the latest site redesign — what I changed, what I kept, and the small details I'm proud of.",
        content:
          "Version 7 of the site brings a left sidebar, a proper light/dark toggle, and a Bluesky link in place of the old Twitter one. The goal was to keep the warmth of previous versions while making it easier to find things.",
        published: true,
      },
      {
        slug: "year-in-review-2023-into-2024",
        title: "Year in Review: 2023 into 2024",
        excerpt: "What I shipped, what I learned, and the books and albums that defined 2023 for me.",
        content: "A retrospective on a year of building, writing, and traveling.",
        published: true,
      },
      {
        slug: "year-in-review-2022-into-2023",
        title: "Year in Review: 2022 into 2023",
        excerpt: "Reflections on a transitional year — new city, new projects, new questions.",
        content: "2022 was a year of change. Here's what stayed with me.",
        published: true,
      },
      {
        slug: "the-lore-of-animorphs",
        title: "The Lore of Animorphs (an Ode)",
        excerpt: "An overdue love letter to a children's book series that turned out to be much more.",
        content:
          "I read Animorphs as a kid and didn't realize until much later just how strange and ambitious those books were. This is a small ode.",
        published: true,
      },
    ]);
  }

  const [projectCount] = await db.select().from(projectsTable).limit(1);
  if (!projectCount) {
    await db.insert(projectsTable).values([
      {
        title: "Keyboard Accordion",
        description: "Play the accordion online with your computer keyboard.",
        year: 2022,
        articleUrl: "https://example.com/keyboard-accordion",
        demoUrl: "https://example.com/keyboard-accordion/demo",
        sourceUrl: "https://github.com/example/keyboard-accordion",
        published: true,
      },
      {
        title: "TakeNote",
        description: "An open-source notes app for the web.",
        year: 2020,
        articleUrl: "https://example.com/takenote",
        demoUrl: "https://example.com/takenote/demo",
        sourceUrl: "https://github.com/example/takenote",
        published: true,
      },
      {
        title: "Chip8",
        description: "A retro game emulator written in JavaScript.",
        year: 2019,
        articleUrl: "https://example.com/chip8",
        demoUrl: "https://example.com/chip8/demo",
        sourceUrl: "https://github.com/example/chip8",
        published: true,
      },
      {
        title: "Sokoban",
        description: "A web-based Sokoban puzzle game.",
        year: 2021,
        articleUrl: "https://example.com/sokoban",
        demoUrl: "https://example.com/sokoban/demo",
        sourceUrl: "https://github.com/example/sokoban",
        published: true,
      },
      {
        title: "New Moon",
        description: "Your new favorite syntax theme — clean, dark, and easy on the eyes.",
        year: 2015,
        demoUrl: "https://example.com/new-moon",
        sourceUrl: "https://github.com/example/new-moon",
        published: true,
      },
      {
        title: "Snek",
        description: "A terminal-based Snake game written in Python.",
        year: 2019,
        articleUrl: "https://example.com/snek",
        demoUrl: "https://example.com/snek/demo",
        sourceUrl: "https://github.com/example/snek",
        published: true,
      },
    ]);
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
