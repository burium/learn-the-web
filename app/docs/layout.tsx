import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import dynamic from "next/dynamic";

const DynamicAssistant = dynamic(() => import("@/components/assistant-dialog"));

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions}
      tree={source.pageTree}
      links={[]}
      sidebar={{
        defaultOpenLevel: 1,
      }}
    >
      {children}
      <DynamicAssistant api={process.env.AI_API_ENDPOINT as string} />
    </DocsLayout>
  );
}
