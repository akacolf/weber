"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Download,
  Printer,
  Copy,
  Check,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Code2,
  FileText,
  Terminal,
  ExternalLink,
  Sparkles,
  Cpu,
  Boxes,
  ShieldCheck,
  CheckCircle2,
  GitBranch,
} from "lucide-react";

function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

export interface ResumeData {
  name: string;
  role: string;
  affiliation: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  githubUrl: string;
  linkedin: string;
  linkedinUrl: string;
  profile: string;
  education: {
    degree: string;
    institution: string;
    location: string;
    period: string;
    coursework: string[];
  };
  experience: {
    company: string;
    role: string;
    period: string;
    highlights: string[];
  }[];
  projects: {
    name: string;
    tagline: string;
    period: string;
    highlights: string[];
    stack: string[];
    url?: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  certifications: {
    title: string;
    issuer: string;
    year: string;
  }[];
  extracurricular: {
    title: string;
    period?: string;
    description: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
}

export const RESUME_DATA: ResumeData = {
  name: "KHALID AL SHAREEF",
  role: "AI Engineer & Full-Stack Developer",
  affiliation: "Founder | Anaxonic",
  location: "Gaziantep, Turkey",
  email: "khalidthenoble@gmail.com",
  phone: "+90 501 525 00 45",
  github: "akacolf",
  githubUrl: "https://github.com/akacolf",
  linkedin: "Khalid Al Shareef",
  linkedinUrl: "https://linkedin.com/in/khalidalshareef",
  profile:
    "AI Engineer & Full-Stack Developer with hands-on experience building and shipping AI-powered applications and consumer software. Founder of a scaled product with 3000 users, combined with experience architecting products across AI, web, mobile, and blockchain. Experienced with Python, TypeScript, React, Next.js, LLMs, and agentic systems.",
  education: {
    degree: "B.Sc. in Electrical & Electronics Engineering (100% English)",
    institution: "University of Gaziantep",
    location: "Gaziantep, TR",
    period: "Sep 2022 – Present",
    coursework: [
      "Applied Linear Algebra",
      "Applied Differential Equations",
      "Introduction to Embedded Systems",
      "Digital Design",
      "Programming in C++",
      "Introduction to AI",
      "Microcontrollers & Microprocessors",
      "Programmable Logic Controllers",
    ],
  },
  experience: [
    {
      company: "Anaxonic",
      role: "Founder",
      period: "Mar 2024 – Present",
      highlights: [
        "Lead the development of AI-powered software products, defining product architecture, technical direction, and R&D roadmap.",
        "Architect and develop applications across AI, full-stack web, and autonomous/agentic systems.",
        "Lead product development from technical research and prototyping through deployment and iteration.",
        "Work across software architecture, AI integration, product development, and security to develop reliable AI systems.",
      ],
    },
    {
      company: "Enbis Automation",
      role: "Automation Systems Engineer Intern",
      period: "Jul 2026 – Aug 2026",
      highlights: [
        "Assisted with engineering operations and project development within an industrial automation environment.",
        "Supported technical workflows and gained practical exposure to automation systems and engineering processes.",
      ],
    },
    {
      company: "Living It English Cafe",
      role: "Teacher",
      period: "Aug 2025 – Nov 2025",
      highlights: [
        "Adapted quickly to a fast-paced professional environment and developed communication, presentation, and interpersonal skills.",
      ],
    },
  ],
  projects: [
    {
      name: "Quantum Club",
      tagline: "Web3 Super App",
      period: "Mar 2024 – Jul 2026",
      highlights: [
        "Architected and developed a Web3 super app combining social features, asset management, AI interactions, and blockchain functionality.",
        "Shipped the product to 3000 users, demonstrating end-to-end product development and deployment experience.",
        "Designed the full-stack application across frontend, backend, AI integrations, and blockchain interactions.",
      ],
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "TON Blockchain", "AI Agents"],
      url: "https://github.com/akacolf/quantum-club-webapp",
    },
    {
      name: "Jarvis Wallet",
      tagline: "Voice-first DeFi Wallet",
      period: "Mar 2024 – Jul 2026",
      highlights: [
        "Developed an agentic wallet that interprets natural-language voice commands and executes user-intended transactions through the application UI.",
        "Built with n8n, Python, Google Generative AI, and Google TTS.",
      ],
      stack: ["Python", "n8n", "Google Gemini API", "Google TTS", "DeFi"],
    },
  ],
  skills: [
    {
      category: "Programming Languages",
      items: ["JavaScript", "TypeScript", "Python", "C++", "Assembly"],
    },
    {
      category: "Web & Frontend",
      items: ["Next.js", "React", "Tailwind CSS", "HTML5", "CSS3"],
    },
    {
      category: "Mobile",
      items: ["React Native", "Expo"],
    },
    {
      category: "AI & Machine Learning",
      items: ["PyTorch", "Google Gemini API", "LLMs", "Generative AI", "AI Agents"],
    },
    {
      category: "Blockchain & Web3",
      items: ["Web3", "DeFi", "Smart Contracts", "TON"],
    },
    {
      category: "Tools & Infrastructure",
      items: ["Git", "GitHub", "Linux", "VS Code", "Cursor", "Vercel", "Claude Code", "Codex", "n8n"],
    },
  ],
  certifications: [
    {
      title: "Practical Automation and PLC Training",
      issuer: "Odaksan Engineering",
      year: "2025",
    },
  ],
  extracurricular: [
    {
      title: "CTF 3 & CTF 4 Hackathon Competitions",
      description:
        "Participated as part of a team in the CTF 3 organized by Hasan Kalyoncu University Software Community, securing 1st place; participated as part of a team in the CTF 4 organized by Hasan Kalyoncu University Software Community, securing 3rd place.",
    },
    {
      title: "Teknofest 2026 | Blockchain Competition",
      period: "Feb 2026 – Jul 2026",
      description: "The Project Evaluation Report stage has been successfully passed through referee evaluation.",
    },
    {
      title: "Head of Software | GAUN Blockchain Community",
      period: "Dec 2025 – Present",
      description:
        "Work with other department leads to organize events, workshops, and technical sessions. Instruct educational event attendees on fundamentals and architecture of blockchain technology.",
    },
    {
      title: "Member | GAUN English Debating and Public Speaking Club & GAUN Blockchain Community",
      period: "Oct 2024 – Present",
      description: "Active speaker and community participant.",
    },
    {
      title: "Member | GAUN Google DSC & GAUN Software Community",
      period: "Oct 2022 – Jan 2024",
      description: "Student developer community collaboration and technical workshops.",
    },
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Turkish", proficiency: "Bilingual" },
    { language: "Arabic", proficiency: "Advanced" },
    { language: "German", proficiency: "A1 (Elementary)" },
    { language: "French", proficiency: "A1 (Elementary)" },
  ],
};

const CODE_REPRESENTATION = `// khalid-alshareef.resume.ts
// AI Engineer & Full-Stack Developer • Founder @ Anaxonic

export interface DeveloperResume {
  name: string;
  role: string;
  founder: string;
  location: string;
  contact: {
    email: string;
    phone: string;
    github: string;
    linkedin: string;
  };
  profile: string;
  education: {
    degree: string;
    school: string;
    timeline: string;
    coursework: string[];
  };
  skills: Record<string, string[]>;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }>;
  projects: Array<{
    title: string;
    category: string;
    period: string;
    metrics: string;
    stack: string[];
  }>;
  awardsAndLeadership: string[];
  spokenLanguages: Record<string, string>;
}

export const khalidAlShareef: DeveloperResume = {
  name: "Khalid Al Shareef",
  role: "AI Engineer & Full-Stack Developer",
  founder: "Anaxonic",
  location: "Gaziantep, Turkey",

  contact: {
    email: "khalidthenoble@gmail.com",
    phone: "+90 501 525 00 45",
    github: "https://github.com/akacolf",
    linkedin: "https://linkedin.com/in/khalidalshareef",
  },

  profile:
    "AI Engineer & Full-Stack Developer with hands-on experience building and " +
    "shipping AI-powered applications and consumer software. Founder of a " +
    "scaled product with 3,000 users, combined with experience architecting " +
    "products across AI, web, mobile, and blockchain.",

  education: {
    degree: "B.Sc. in Electrical & Electronics Engineering (100% English)",
    school: "University of Gaziantep, Gaziantep, TR",
    timeline: "Sep 2022 – Present",
    coursework: [
      "Applied Linear Algebra",
      "Applied Differential Equations",
      "Introduction to Embedded Systems",
      "Digital Design",
      "Programming in C++",
      "Introduction to AI",
      "Microcontrollers & Microprocessors",
      "Programmable Logic Controllers",
    ],
  },

  skills: {
    languages: ["JavaScript", "TypeScript", "Python", "C++", "Assembly"],
    web: ["Next.js", "React", "Tailwind CSS"],
    mobile: ["React Native", "Expo"],
    ai_ml: ["PyTorch", "Google Gemini API", "LLMs", "Generative AI", "AI Agents"],
    blockchain: ["Web3", "DeFi", "Smart Contracts", "TON"],
    tools: ["Git", "GitHub", "Linux", "VS Code", "Cursor", "Vercel", "Claude Code", "Codex", "n8n"],
  },

  experience: [
    {
      company: "Anaxonic",
      role: "Founder",
      period: "Mar 2024 – Present",
      bullets: [
        "Lead development of AI-powered software products, defining architecture & R&D roadmap.",
        "Architect and develop applications across AI, full-stack web, and agentic systems.",
        "Drive product from technical research and prototyping through deployment and iteration.",
      ],
    },
    {
      company: "Enbis Automation",
      role: "Automation Systems Engineer Intern",
      period: "Jul 2026 – Aug 2026",
      bullets: [
        "Assisted engineering operations and project development in industrial automation.",
        "Supported workflows and gained practical exposure to automation systems.",
      ],
    },
    {
      company: "Living It English Cafe",
      role: "Teacher",
      period: "Aug 2025 – Nov 2025",
      bullets: [
        "Adapted to fast-paced environment; trained communication and interpersonal skills.",
      ],
    },
  ],

  projects: [
    {
      title: "Quantum Club",
      category: "Web3 Super App",
      period: "Mar 2024 – Jul 2026",
      metrics: "Shipped to 3,000 users; full-stack DeFi, social, AI integrations",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "TON", "AI"],
    },
    {
      title: "Jarvis Wallet",
      category: "Voice-first DeFi Wallet",
      period: "Mar 2024 – Jul 2026",
      metrics: "Agentic voice commands execution through UI",
      stack: ["n8n", "Python", "Google Generative AI", "Google TTS"],
    },
  ],

  awardsAndLeadership: [
    "CTF 3 - 1st Place (Hasan Kalyoncu University Software Community)",
    "CTF 4 - 3rd Place (Hasan Kalyoncu University Software Community)",
    "Teknofest 2026 Blockchain Competition - Passed referee evaluation",
    "Head of Software @ GAUN Blockchain Community (Dec 2025 – Present)",
    "Practical Automation and PLC Training Certification (Odaksan Engineering, 2025)",
  ],

  spokenLanguages: {
    English: "Native",
    Turkish: "Bilingual",
    Arabic: "Advanced",
    German: "A1 (Elementary)",
    French: "A1 (Elementary)",
  },
};`;

export default function ResumeView() {
  const [viewMode, setViewMode] = useState<"document" | "code">("document");
  const [copied, setCopied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE_REPRESENTATION);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(RESUME_DATA.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Top Bar with View Mode Toggle and Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/40">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl border border-border/60 self-start">
          <button
            type="button"
            onClick={() => setViewMode("document")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
              viewMode === "document"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Interactive Resume"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive Resume</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("code")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer",
              viewMode === "code"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Code view resume.ts"
          >
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span>resume.ts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Cody
            </span>
          </button>
        </div>

        {/* Right: Actions (Download PDF, Print, Copy) */}
        <div className="flex items-center flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyEmail}
            className="text-xs h-9 rounded-lg gap-1.5 cursor-pointer"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied email!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Copy email</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs h-9 rounded-lg gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Print / Save</span>
          </Button>

          <a
            href="/resume_KhalidAlShareef.pdf"
            download="Khalid_AlShareef_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-sm select-none"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* CODE VIEW */}
      {viewMode === "code" && (
        <div className="rounded-xl border border-border/80 bg-neutral-950 text-neutral-100 shadow-2xl overflow-hidden font-mono text-xs">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-white/10 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-neutral-400 text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                khalid-alshareef.resume.ts
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              className="text-neutral-300 hover:text-white hover:bg-white/10 h-7 px-2.5 text-xs gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy TS Code</span>
                </>
              )}
            </Button>
          </div>

          {/* Code Content */}
          <div className="p-4 sm:p-6 overflow-x-auto max-h-[750px] leading-relaxed">
            <pre className="text-neutral-300 font-mono text-[12px] whitespace-pre">
              {CODE_REPRESENTATION}
            </pre>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-900/90 border-t border-white/5 text-[11px] text-neutral-400 select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-neutral-400" />
                <span>main</span>
              </span>
              <span>|</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Valid TypeScript schema</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span>TypeScript 5.x</span>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT / INTERACTIVE RESUME VIEW */}
      {viewMode === "document" && (
        <div className="bg-card text-card-foreground rounded-2xl border border-border/60 shadow-xl p-6 sm:p-10 space-y-10 print:border-none print:shadow-none print:p-0">
          {/* Header Section */}
          <div className="space-y-4 pb-6 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-serif">
                  {RESUME_DATA.name}
                </h1>
                <p className="text-lg sm:text-xl font-medium text-foreground/90 mt-1">
                  {RESUME_DATA.role}
                </p>
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {RESUME_DATA.affiliation}
                </p>
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start">
                <Sparkles className="w-3 h-3" />
                <span>Available for projects</span>
              </div>
            </div>

            {/* Contact Pills */}
            <div className="flex flex-wrap gap-2.5 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-foreground/70" />
                {RESUME_DATA.location}
              </span>
              <a
                href={`mailto:${RESUME_DATA.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-foreground/70" />
                {RESUME_DATA.email}
              </a>
              <a
                href={`tel:${RESUME_DATA.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-foreground/70" />
                {RESUME_DATA.phone}
              </a>
              <Link
                href={RESUME_DATA.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5 text-foreground/70" />
                <span>akacolf</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href={RESUME_DATA.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-foreground/70" />
                <span>Khalid Al Shareef</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          {/* Profile / Summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              Profile
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground bg-secondary/20 p-4 rounded-xl border border-border/40">
              {RESUME_DATA.profile}
            </p>
          </div>

          {/* Work Experience */}
          <div className="space-y-6">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-foreground/70" />
              Work Experience
            </h2>

            <div className="space-y-6 pl-1">
              {RESUME_DATA.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="relative pl-6 border-l-2 border-border/60 pb-2 space-y-2 group"
                >
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-border group-hover:bg-foreground transition-colors" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-base font-semibold text-foreground">
                      {exp.company}{" "}
                      <span className="text-muted-foreground font-normal">| {exp.role}</span>
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">{exp.period}</span>
                  </div>

                  <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground pt-1 list-disc list-outside pl-4 leading-relaxed">
                    {exp.highlights.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="space-y-6">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <Boxes className="w-3.5 h-3.5 text-foreground/70" />
              Featured Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RESUME_DATA.projects.map((proj, idx) => (
                <Card
                  key={idx}
                  className="p-5 border-border/60 bg-card/60 backdrop-blur-xs flex flex-col justify-between gap-4 hover:border-foreground/20 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                          {proj.name}
                          {proj.url && (
                            <Link
                              href={proj.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </h3>
                        <p className="text-xs font-medium text-muted-foreground">
                          {proj.tagline}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {proj.period}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-muted-foreground pt-1 list-disc list-outside pl-4 leading-relaxed">
                      {proj.highlights.map((h, hIdx) => (
                        <li key={hIdx}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                    {proj.stack.map((tech, tIdx) => (
                      <Badge
                        key={tIdx}
                        variant="secondary"
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-foreground/70" />
              Education
            </h2>

            <div className="p-5 rounded-xl border border-border/60 bg-secondary/15 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {RESUME_DATA.education.degree}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {RESUME_DATA.education.institution}, {RESUME_DATA.education.location}
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {RESUME_DATA.education.period}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground/80 mb-2">Relevant coursework:</p>
                <div className="flex flex-wrap gap-1.5">
                  {RESUME_DATA.education.coursework.map((course, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-background border border-border/50 text-muted-foreground"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills Grid */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-foreground/70" />
              Technical Skills
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RESUME_DATA.skills.map((skillGroup, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3.5 rounded-xl border border-border/50 bg-secondary/10 space-y-2"
                >
                  <p className="text-xs font-semibold text-foreground font-mono">
                    {skillGroup.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGroup.items.map((item, iIdx) => (
                      <span
                        key={iIdx}
                        className="text-[11px] px-2 py-0.5 rounded bg-background/80 border border-border/40 text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Extracurricular */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Extracurricular & Competitions */}
            <div className="space-y-4">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-foreground/70" />
                Extracurricular &amp; Honors
              </h2>

              <div className="space-y-3">
                {RESUME_DATA.extracurricular.map((item, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-3.5 rounded-xl border border-border/40 bg-secondary/10 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-foreground">{item.title}</span>
                      {item.period && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {item.period}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Certifications & Languages */}
            <div className="space-y-6">
              {/* Certifications */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-foreground/70" />
                  Certifications
                </h2>

                <div className="space-y-2">
                  {RESUME_DATA.certifications.map((cert, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3.5 rounded-xl border border-border/40 bg-secondary/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{cert.title}</p>
                        <p className="text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {cert.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spoken Languages */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                  <Languages className="w-3.5 h-3.5 text-foreground/70" />
                  Spoken Languages
                </h2>

                <div className="grid grid-cols-2 gap-2">
                  {RESUME_DATA.languages.map((lang, lIdx) => (
                    <div
                      key={lIdx}
                      className="p-3 rounded-lg border border-border/40 bg-secondary/10 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-foreground">{lang.language}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
