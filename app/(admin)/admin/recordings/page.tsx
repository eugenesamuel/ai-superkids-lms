import { redirect } from "next/navigation";

// Recordings are managed inline on each batch page now (Recordings tab).
export default function AdminRecordingsRedirect() {
  redirect("/admin/batches");
}
