import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "<My resume/cv>",
};

export default function ResumePage() {
  return <main className="flex-1 bg-background" />;
}
