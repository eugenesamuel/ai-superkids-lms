import { redirect } from "next/navigation";
import { mockPlanets } from "@/lib/mock-data";

// Sessions has been merged into the Course page (each mission row links to its recording).
// Redirect /sessions to the current planet so old links still work.
export default function SessionsRedirect() {
  const target =
    mockPlanets.find((p) => p.status === "current")?.id ??
    mockPlanets[0]?.id ??
    "planet-1";
  redirect(`/course/${target}`);
}
