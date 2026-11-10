"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ExternalLink,
  Cpu,
  Boxes,
  ShieldCheck,
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
  photo?: string;
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
  affiliation: "Ex. Founder and Lead Engineer | Anaxonic",
  photo: "/my photo.jpg",
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
      role: "Founder & Lead Engineer",
      period: "Mar 2024 – Nov 2026",
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

export default function ResumeView() {
  const [copiedEmail, setCopiedEmail] = useState(false);

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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 print:max-w-none print:w-full print:p-0 print:m-0">
      {/* Top Bar with Actions (Hidden during print) */}
      <div className="flex items-center justify-end flex-wrap gap-2.5 mb-8 pb-6 border-b border-border/40 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyEmail}
          className="text-xs h-9 rounded-lg gap-1.5 cursor-pointer"
          aria-label="Copy email address"
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
          <span>Print / Save</span>
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

      {/* DOCUMENT RESUME VIEW */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/60 shadow-xl p-6 sm:p-10 space-y-10 print:border-none print:shadow-none print:p-0 print:m-0 print:space-y-6 print:bg-white print:text-neutral-900">
        {/* Header Section */}
        <div className="space-y-4 pb-6 border-b border-border/40 print:pb-4 print:border-neutral-200 print-avoid-break">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-serif print:text-neutral-950">
                {RESUME_DATA.name}
              </h1>
              <p className="text-lg sm:text-xl font-medium text-foreground/90 print:text-neutral-900">
                {RESUME_DATA.role}
              </p>
              <p className="text-sm text-muted-foreground font-medium print:text-neutral-600">
                {RESUME_DATA.affiliation}
              </p>
            </div>

            {RESUME_DATA.photo && (
              <div className="relative shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-border/80 shadow-md bg-secondary/30 print:w-20 print:h-20 print:border-neutral-300 print:shadow-none">
                  <Image
                    src={RESUME_DATA.photo}
                    alt={RESUME_DATA.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact Pills */}
          <div className="flex flex-wrap gap-2.5 pt-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground print:bg-neutral-100 print:border-neutral-200 print:text-neutral-800">
              <MapPin className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-700" />
              {RESUME_DATA.location}
            </span>
            <a
              href={`mailto:${RESUME_DATA.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors print:bg-neutral-100 print:border-neutral-200 print:text-neutral-800"
            >
              <Mail className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-700" />
              {RESUME_DATA.email}
            </a>
            <a
              href={`tel:${RESUME_DATA.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors print:bg-neutral-100 print:border-neutral-200 print:text-neutral-800"
            >
              <Phone className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-700" />
              {RESUME_DATA.phone}
            </a>
            <Link
              href={RESUME_DATA.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors print:bg-neutral-100 print:border-neutral-200 print:text-neutral-800"
            >
              <GithubIcon className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-700" />
              <span>akacolf</span>
              <ExternalLink className="w-3 h-3 opacity-60 print:hidden" />
            </Link>
            <Link
              href={RESUME_DATA.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors print:bg-neutral-100 print:border-neutral-200 print:text-neutral-800"
            >
              <LinkedinIcon className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-700" />
              <span>Khalid Al Shareef</span>
              <ExternalLink className="w-3 h-3 opacity-60 print:hidden" />
            </Link>
          </div>
        </div>

        {/* Profile / Summary */}
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground print:text-neutral-700 print-avoid-break">
          {RESUME_DATA.profile}
        </p>

        {/* Education */}
        <div className="space-y-4 print-avoid-break">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 print:text-neutral-900">
            <GraduationCap className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-800" />
            Education
          </h2>

          <div className="p-5 rounded-xl border border-border/60 bg-secondary/15 space-y-3 print:bg-neutral-50 print:border-neutral-200 print:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h3 className="text-base font-semibold text-foreground print:text-neutral-950">
                  {RESUME_DATA.education.degree}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground print:text-neutral-700">
                  {RESUME_DATA.education.institution}, {RESUME_DATA.education.location}
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground shrink-0 whitespace-nowrap print:text-neutral-600">
                {RESUME_DATA.education.period}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-foreground/80 mb-2 print:text-neutral-800">Relevant coursework:</p>
              <div className="flex flex-wrap gap-1.5">
                {RESUME_DATA.education.coursework.map((course, cIdx) => (
                  <span
                    key={cIdx}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-background border border-border/50 text-muted-foreground print:bg-white print:border-neutral-300 print:text-neutral-800"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="space-y-6 print-avoid-break">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 print:text-neutral-900">
            <Boxes className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-800" />
            Featured Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
            {RESUME_DATA.projects.map((proj, idx) => (
              <Card
                key={idx}
                className="p-5 border-border/60 bg-card/60 backdrop-blur-xs flex flex-col justify-between gap-4 hover:border-foreground/20 transition-colors print:bg-neutral-50 print:border-neutral-200 print:p-4 print:shadow-none print-avoid-break"
              >
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-foreground flex items-center gap-2 print:text-neutral-950">
                        {proj.name}
                        {proj.url && (
                          <Link
                            href={proj.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground print:hidden"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground print:text-neutral-600">
                        {proj.tagline}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0 whitespace-nowrap print:text-neutral-600">
                      {proj.period}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-muted-foreground pt-1 list-disc list-outside pl-4 leading-relaxed print:text-neutral-700">
                    {proj.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40 print:border-neutral-200">
                  {proj.stack.map((tech, tIdx) => (
                    <Badge
                      key={tIdx}
                      variant="secondary"
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md print:bg-white print:border-neutral-300 print:text-neutral-800"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div className="space-y-6 print-avoid-break">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 print:text-neutral-900">
            <Briefcase className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-800" />
            Work Experience
          </h2>

          <div className="space-y-6 pl-1 print:space-y-4">
            {RESUME_DATA.experience.map((exp, idx) => (
              <div
                key={idx}
                className="relative pl-6 border-l-2 border-border/60 pb-2 space-y-2 group print:border-neutral-300 print:pb-2 print-avoid-break"
              >
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-border group-hover:bg-foreground transition-colors print:bg-neutral-800" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-base font-semibold text-foreground print:text-neutral-950">
                    {exp.company}{" "}
                    <span className="text-muted-foreground font-normal print:text-neutral-600">| {exp.role}</span>
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground shrink-0 whitespace-nowrap print:text-neutral-600">{exp.period}</span>
                </div>

                <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground pt-1 list-disc list-outside pl-4 leading-relaxed print:text-neutral-700">
                  {exp.highlights.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills Grid */}
        <div className="space-y-4 print-avoid-break">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 print:text-neutral-900">
            <Cpu className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-800" />
            Technical Skills
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-3 print:gap-2">
            {RESUME_DATA.skills.map((skillGroup, sIdx) => (
              <div
                key={sIdx}
                className="p-3.5 rounded-xl border border-border/50 bg-secondary/10 space-y-2 print:bg-neutral-50 print:border-neutral-200 print:p-3 print-avoid-break"
              >
                <p className="text-xs font-semibold text-foreground font-mono print:text-neutral-950">
                  {skillGroup.category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skillGroup.items.map((item, iIdx) => (
                    <span
                      key={iIdx}
                      className="text-[11px] px-2 py-0.5 rounded bg-background/80 border border-border/40 text-muted-foreground print:bg-white print:border-neutral-300 print:text-neutral-800"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 print:grid-cols-2 print:gap-4 print-avoid-break">
          {/* Extracurricular & Competitions */}
          <div className="space-y-4 print-avoid-break">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 print:text-neutral-900">
              <Award className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-800" />
              Extracurricular &amp; Honors
            </h2>

            <div className="space-y-3 print:space-y-2">
              {RESUME_DATA.extracurricular.map((item, eIdx) => (
                <div
                  key={eIdx}
                  className="p-3.5 rounded-xl border border-border/40 bg-secondary/10 space-y-1.5 text-xs print:bg-neutral-50 print:border-neutral-200 print:p-3 print-avoid-break"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3">
                    <span className="font-semibold text-foreground leading-snug print:text-neutral-950">{item.title}</span>
                    {item.period && (
                      <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground shrink-0 whitespace-nowrap print:text-neutral-600">
                        {item.period}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed print:text-neutral-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Certifications & Languages */}
          <div className="space-y-6 print:space-y-4 print-avoid-break">
            {/* Certifications */}
            <div className="space-y-4 print-avoid-break">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 print:text-neutral-900">
                <ShieldCheck className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-800" />
                Certifications
              </h2>

              <div className="space-y-2">
                {RESUME_DATA.certifications.map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3.5 rounded-xl border border-border/40 bg-secondary/10 flex items-center justify-between gap-3 text-xs print:bg-neutral-50 print:border-neutral-200 print:p-3 print-avoid-break"
                  >
                    <div>
                      <p className="font-semibold text-foreground print:text-neutral-950">{cert.title}</p>
                      <p className="text-muted-foreground print:text-neutral-600">{cert.issuer}</p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0 whitespace-nowrap print:text-neutral-600">
                      {cert.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spoken Languages */}
            <div className="space-y-4 print-avoid-break">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2 print:text-neutral-900">
                <Languages className="w-3.5 h-3.5 text-foreground/70 print:text-neutral-800" />
                Spoken Languages
              </h2>

              <div className="grid grid-cols-2 gap-2 print:grid-cols-2 print:gap-2">
                {RESUME_DATA.languages.map((lang, lIdx) => (
                  <div
                    key={lIdx}
                    className="p-3 rounded-lg border border-border/40 bg-secondary/10 flex items-center justify-between text-xs print:bg-neutral-50 print:border-neutral-200 print:p-2.5 print-avoid-break"
                  >
                    <span className="font-medium text-foreground print:text-neutral-900">{lang.language}</span>
                    <span className="text-[11px] text-muted-foreground font-mono print:text-neutral-600">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
