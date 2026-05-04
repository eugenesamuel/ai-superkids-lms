import { Sidebar } from "@/components/lms/Sidebar";
import { MobileNav } from "@/components/lms/MobileNav";
import { mockUser } from "@/lib/mock-data";
import { WelcomeBar } from "@/components/lms/WelcomeBar";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  // In production, replace mockUser with the result of verifying the Firebase ID token in middleware
  // and fetching the user doc from Firestore.
  const user = mockUser;

  return (
    <div className="min-h-screen kid-bg pb-20 lg:pb-6">
      <div className="mx-auto max-w-[1800px] p-3 sm:p-5 lg:p-6">
        <div className="app-shell flex overflow-hidden min-h-[calc(100vh-3rem)]">
          <Sidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <WelcomeBar user={user} />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
