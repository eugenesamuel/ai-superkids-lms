import { redirect } from "next/navigation";

// Live class scheduling moved off-platform (Zoom). Recordings are managed at /admin/recordings.
export default function AdminLiveRedirect() {
  redirect("/admin/recordings");
}
