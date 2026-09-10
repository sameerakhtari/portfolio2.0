import { notFound } from "next/navigation";
import { PigmentBench } from "@/components/experience/PigmentBench";
export const metadata = {
  title: "Pigment development study",
  robots: { index: false, follow: false },
};
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return <PigmentBench />;
}
