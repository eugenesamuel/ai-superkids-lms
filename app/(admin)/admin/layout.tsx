import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminWelcomeBar } from "@/components/admin/AdminWelcomeBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen kid-bg">
      <div className="mx-auto max-w-[1320px] p-3 sm:p-5 lg:p-6">
        <div className="app-shell flex overflow-hidden min-h-[calc(100vh-3rem)]">
          <AdminSidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <AdminWelcomeBar />
            <main className="flex-1 overflow-y-auto bg-neutral-50/50">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
