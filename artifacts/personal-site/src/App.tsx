import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "@/lib/auth";

import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

import Home from "@/pages/Home";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import NotesList from "@/pages/NotesList";
import NoteDetail from "@/pages/NoteDetail";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import SignInPage from "@/pages/SignInPage";

import DashboardOverview from "@/pages/dashboard/Overview";
import DashboardPosts from "@/pages/dashboard/PostsManage";
import DashboardPostEdit from "@/pages/dashboard/PostEdit";
import DashboardNotes from "@/pages/dashboard/NotesManage";
import DashboardNoteEdit from "@/pages/dashboard/NoteEdit";
import DashboardProjects from "@/pages/dashboard/ProjectsManage";
import DashboardProjectEdit from "@/pages/dashboard/ProjectEdit";
import DashboardAbout from "@/pages/dashboard/AboutEdit";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const [, setLocation] = useLocation();

  if (!isLoaded) return null;
  if (!isSignedIn) {
    setLocation("/sign-in");
    return null;
  }
  return <>{children}</>;
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRouter() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/sign-in/*?" component={SignInPage} />

        <Route path="/dashboard" nest>
          <RequireAuth>
            <AdminLayout>
              <Switch>
                <Route path="/" component={DashboardOverview} />
                <Route path="/posts" component={DashboardPosts} />
                <Route path="/posts/new" component={DashboardPostEdit} />
                <Route path="/posts/:id" component={DashboardPostEdit} />
                <Route path="/notes" component={DashboardNotes} />
                <Route path="/notes/new" component={DashboardNoteEdit} />
                <Route path="/notes/:id" component={DashboardNoteEdit} />
                <Route path="/projects" component={DashboardProjects} />
                <Route path="/projects/new" component={DashboardProjectEdit} />
                <Route path="/projects/:id" component={DashboardProjectEdit} />
                <Route path="/about" component={DashboardAbout} />
                <Route component={NotFound} />
              </Switch>
            </AdminLayout>
          </RequireAuth>
        </Route>

        <Route>
          <PublicLayout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/blog" component={BlogList} />
              <Route path="/blog/:slug" component={BlogPost} />
              <Route path="/notes" component={NotesList} />
              <Route path="/notes/:slug" component={NoteDetail} />
              <Route path="/projects" component={Projects} />
              <Route path="/about" component={About} />
              <Route component={NotFound} />
            </Switch>
          </PublicLayout>
        </Route>
      </Switch>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <AppRouter />
        </WouterRouter>
        <Toaster richColors position="bottom-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
