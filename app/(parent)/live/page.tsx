import { redirect } from "next/navigation";

// Live classes happen on Zoom — this app only hosts the recordings.
// /live now redirects to the recordings library.
export default function LiveRedirect() {
  redirect("/sessions");
}
