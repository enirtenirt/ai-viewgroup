import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VIEW Group - for konsern" },
      { name: "description", content: "AI`en din lyver til styret. Men den vet det ikke selv." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "VIEW Group - for konsern" },
      { property: "og:description", content: "AI`en din lyver til styret. Men den vet det ikke selv." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "VIEW Group - for konsern" },
      { name: "twitter:description", content: "AI`en din lyver til styret. Men den vet det ikke selv." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/WMe5xQVj3kRDzdJJg4FN9lFiegJ2/social-images/social-1778158180767-VIEW_Group_-_økonomistrying_og_regnskap_.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/WMe5xQVj3kRDzdJJg4FN9lFiegJ2/social-images/social-1778158180767-VIEW_Group_-_økonomistrying_og_regnskap_.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
