import type { Metadata } from "next";
import ResumeView from "@/components/ResumeView";

export const metadata: Metadata = {
  title: "<My resume/cv>",
  description:
    "Official resume and curriculum vitae of Khalid Al Shareef (Colf). AI Engineer & Full-Stack Developer, Founder at Anaxonic, B.Sc. Electrical & Electronics Engineering at University of Gaziantep.",
};

export default function ResumePage() {
  return (
    <main className="flex-1 bg-background relative overflow-hidden print:overflow-visible print:bg-white print:p-0 print:m-0">
      {/* Background subtle radial ambient light */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-foreground/[0.02] dark:bg-white/[0.02] blur-[150px] rounded-full pointer-events-none -z-10 print:hidden" />

      <ResumeView />
    </main>
  );
}
