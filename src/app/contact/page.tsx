import type { Metadata } from "next";
import ContactView from "@/components/ContactView";

export const metadata: Metadata = {
  title: "<Contact me>",
  description:
    "Get in touch with Colf (Khalid Al Shareef). Send a message or book a meeting directly on Google Calendar.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 bg-background relative overflow-hidden py-12 sm:py-16 md:py-20">
      <ContactView />
    </main>
  );
}
