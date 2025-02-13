import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions}
      tree={source.pageTree}
      links={[]}
      sidebar={{
        tabs: false, // Only one tab is available right now so it's disabled
        defaultOpenLevel: 1,
      }}
    >
      {children}
    </DocsLayout>
  );
}
