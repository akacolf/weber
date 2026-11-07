"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Globe,
  Mail,
  Copy,
  Check,
  Send,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { cn } from "cn";

function GoogleCalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
      aria-hidden="true"
    >
      <path fill="#fff" d="M195.368 60.632H60.632v134.736h134.736z" />
      <path
        fill="#ea4335"
        d="M195.368 256L256 195.368l-30.316-5.172l-30.316 5.172l-5.533 27.73z"
      />
      <path
        fill="#188038"
        d="M0 195.368v40.421C0 246.956 9.044 256 20.21 256h40.422l6.225-30.316l-6.225-30.316l-33.033-5.172z"
      />
      <path
        fill="#1967d2"
        d="M256 60.632V20.21C256 9.044 246.956 0 235.79 0h-40.422q-5.532 22.554-5.533 33.196q0 10.641 5.533 27.436q20.115 5.76 30.316 5.76T256 60.631"
      />
      <path fill="#fbbc04" d="M256 60.632h-60.632v134.736H256z" />
      <path fill="#34a853" d="M195.368 195.368H60.632V256h134.736z" />
      <path
        fill="#4285f4"
        d="M195.368 0H20.211C9.044 0 0 9.044 0 20.21v175.158h60.632V60.632h134.736z"
      />
      <path
        fill="#4285f4"
        d="M88.27 165.154c-5.036-3.402-8.523-8.37-10.426-14.94l11.689-4.816q1.59 6.063 5.558 9.398c2.627 2.223 5.827 3.318 9.566 3.318q5.734 0 9.852-3.487c2.746-2.324 4.127-5.288 4.127-8.875q0-5.508-4.345-8.994c-2.897-2.324-6.535-3.486-10.88-3.486h-6.754v-11.57h6.063q5.608 0 9.448-3.033c2.56-2.02 3.84-4.783 3.84-8.303c0-3.132-1.145-5.625-3.435-7.494c-2.29-1.87-5.188-2.813-8.708-2.813c-3.436 0-6.164.91-8.185 2.745a16.1 16.1 0 0 0-4.413 6.754l-11.57-4.817c1.532-4.345 4.345-8.185 8.471-11.503s9.398-4.985 15.798-4.985c4.733 0 8.994.91 12.767 2.745c3.772 1.836 6.736 4.379 8.875 7.613c2.14 3.25 3.2 6.888 3.2 10.93c0 4.126-.993 7.613-2.98 10.476s-4.43 5.052-7.327 6.585v.69a22.25 22.25 0 0 1 9.398 7.327c2.442 3.284 3.672 7.208 3.672 11.79c0 4.58-1.163 8.673-3.487 12.26c-2.324 3.588-5.54 6.417-9.617 8.472c-4.092 2.055-8.69 3.1-13.793 3.1c-5.912.016-11.369-1.685-16.405-5.087m71.797-58.005l-12.833 9.28l-6.417-9.734l23.023-16.607h8.825v78.333h-12.598z"
      />
    </svg>
  );
}

function GoogleMeetIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 211"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="#00832d"
        d="m144.822 105.322l24.957 28.527l33.562 21.445l5.838-49.792l-5.838-48.669l-34.205 18.839z"
      />
      <path
        fill="#0066da"
        d="M0 150.66v42.43c0 9.688 7.864 17.554 17.554 17.554h42.43l8.786-32.059l-8.786-27.925l-29.11-8.786z"
      />
      <path
        fill="#e94235"
        d="M59.984 0L0 59.984l30.876 8.765l29.108-8.765l8.626-27.545z"
      />
      <path fill="#2684fc" d="M.001 150.679h59.983V59.983H.001z" />
      <path
        fill="#00ac47"
        d="M241.659 25.398L203.34 56.834v98.46l38.477 31.558c5.76 4.512 14.186.4 14.186-6.922V32.18c0-7.403-8.627-11.495-14.345-6.781"
      />
      <path
        fill="#00ac47"
        d="M144.822 105.322v45.338H59.984v59.984h125.804c9.69 0 17.553-7.866 17.553-17.554v-37.796z"
      />
      <path
        fill="#ffba00"
        d="M185.788 0H59.984v59.984h84.838v45.338l58.52-48.49V17.555c0-9.69-7.864-17.554-17.554-17.554"
      />
    </svg>
  );
}

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const email = "khalidthenoble@gmail.com";
  const calendarUrl = "https://calendar.app.google/EtDmg8dKUaTUUYWw7";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to send message. Please try again or email directly."
        );
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setErrorMessage(null);
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal font-serif tracking-tight text-foreground mb-4">
          Let&apos;s build together.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Have an upcoming project, architecture inquiry, or looking to scale a
          team? Leave a detailed message below or reserve a dedicated slot on my
          Google Calendar.
        </p>
      </div>

      {/* Main Grid: Form (Left) & Calendar / Channels (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Shadcn Contact Form (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm h-full flex flex-col justify-between">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-serif font-normal">
                Send a message
              </CardTitle>
              <CardDescription>
                Fill out the details below. I personally review every note and
                reply within 24 hours.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between">
              {isSubmitted ? (
                <div
                  data-testid="contact-success-state"
                  className="py-10 px-4 text-center flex-1 flex flex-col items-center justify-center space-y-4"
                >
                  <Check className="w-8 h-8 text-emerald-500" />
                  <h3 className="text-xl font-medium text-foreground">
                    Message received!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Thank you for reaching out,{" "}
                    <span className="text-foreground font-medium">
                      {formData.name}
                    </span>
                    . I have received your note and will get back to you at{" "}
                    <span className="text-foreground font-medium">
                      {formData.email}
                    </span>{" "}
                    shortly.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="mt-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Send another message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  data-testid="contact-form"
                  className="space-y-5 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Your Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Alex Morgan"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="alex@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject / Project Category</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="e.g. Web3 Architecture, 3D Web Application, Full-Stack Contract"
                        value={formData.subject}
                        onChange={handleChange}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={6}
                        placeholder="Tell me about what you're building, target timeline, key challenges, or how we might collaborate..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="min-h-[140px] resize-y"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      data-testid="contact-error-alert"
                      className="p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      * Required fields
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-10 px-5 gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send message</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Google Calendar Booking Section & Channels (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Calendar Booking Card */}
          <Card
            data-testid="calendar-booking-section"
            className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm relative overflow-hidden shrink-0"
          >
            <CardHeader className="pb-3">
              <div className="mb-2.5">
                <GoogleCalendarIcon className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-serif font-normal">
                Book a meeting
              </CardTitle>
              <CardDescription>
                Prefer a live conversation? Reserve a 30-minute discovery call
                directly on my calendar.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>30-minute discovery & architecture session</span>
                </div>
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <GoogleMeetIcon className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Google Meet conference link generated automatically</span>
                </div>
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>Instant timezone conversion for seamless scheduling</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="book-calendar-btn"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full h-11 text-sm font-medium gap-2 justify-center shadow-sm cursor-pointer bg-white text-black hover:bg-neutral-100 border border-neutral-200/80 dark:border-transparent dark:bg-white dark:text-black dark:hover:bg-neutral-100"
                  )}
                >
                  <Calendar className="w-4 h-4 text-black" />
                  <span className="text-black">Schedule on Google Calendar</span>
                  <ArrowUpRight className="w-4 h-4 text-black" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Quick Email & Social Connect Card */}
          <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm flex-1 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-1">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <span>DIRECT CHANNELS</span>
              </div>
              <CardTitle className="text-base font-serif font-normal">
                Prefer email or social?
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Copy Email Pill */}
              <div className="flex items-center justify-between gap-2 p-2 bg-secondary/50 rounded-xl border border-border">
                <div className="flex items-center gap-2 px-2 overflow-hidden">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="font-mono text-xs text-foreground truncate select-all">
                    {email}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={handleCopyEmail}
                  className="rounded-lg shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500 mr-1" />
                      <span className="text-emerald-500 text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-muted-foreground mr-1" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Social Channels */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono">
                <a
                  href="https://github.com/akacolf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                </a>
                <a
                  href="https://x.com/akacolf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  X / Twitter <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                </a>
                <a
                  href="https://linkedin.com/in/colf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
