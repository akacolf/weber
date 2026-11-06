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
  Video,
  Globe,
  Mail,
  Copy,
  Check,
  Send,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { cn } from "cn";

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate interactive submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4 px-3 py-1 rounded-full bg-secondary/50 border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available for new projects</span>
        </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Shadcn Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>DIRECT INQUIRY</span>
              </div>
              <CardTitle className="text-2xl font-serif font-normal">
                Send a message
              </CardTitle>
              <CardDescription>
                Fill out the details below. I personally review every note and
                reply within 24 hours.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isSubmitted ? (
                <div
                  data-testid="contact-success-state"
                  className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
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
                  className="space-y-5"
                >
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
        <div className="lg:col-span-5 space-y-6">
          {/* Calendar Booking Card */}
          <Card
            data-testid="calendar-booking-section"
            className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm relative overflow-hidden"
          >
            {/* Subtle glow accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

            <CardHeader className="pb-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-sky-500 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>GOOGLE CALENDAR</span>
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
                  <Clock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>30-minute discovery & architecture session</span>
                </div>
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <Video className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>Google Meet conference link generated automatically</span>
                </div>
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <Globe className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
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
                    "w-full h-11 text-sm font-medium gap-2 justify-center shadow-sm cursor-pointer"
                  )}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule on Google Calendar</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Quick Email & Social Connect Card */}
          <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-1">
                <Mail className="w-3.5 h-3.5" />
                <span>DIRECT CHANNELS</span>
              </div>
              <CardTitle className="text-base font-serif font-normal">
                Prefer email or social?
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
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
                  className="rounded-lg shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500 mr-1" />
                      <span className="text-emerald-500 text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
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
                  GitHub <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://x.com/akacolf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  X / Twitter <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href="https://linkedin.com/in/colf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
