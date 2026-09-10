import { notFound } from "next/navigation";
import { ResponsiveBench } from "@/components/experience/ResponsiveBench";
export const metadata = {
  title: "Responsive development review",
  robots: { index: false, follow: false },
};
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ResponsiveBench />;
}
