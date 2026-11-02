import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import { UserMenu } from "@/components/user-menu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          footer={
            <Suspense>
              <UserMenu />
            </Suspense>
          }
        />
        <SidebarInset className="min-w-0">
          <PageHeader />
          <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
