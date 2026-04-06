import { t } from "@lingui/core/macro";
import { Plural, Trans } from "@lingui/react/macro";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowSquareOutIcon,
  BriefcaseIcon,
  CaretDownIcon,
  CheckIcon,
  FileArrowDownIcon,
  FolderOpenIcon,
  FunnelSimpleIcon,
  LinkSimpleIcon,
  MagnifyingGlassIcon,
  PenNibIcon,
  RobotIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/style";

const DEMO_SCORE = 58;
const SEARCH_LINKS_COUNT = 3;
const PROJECTS_COUNT = 0;

export const Route = createFileRoute("/_home/ai-job-search")({
  head: () => ({
    meta: [
      { title: t`AI Job Search — Reactive Resume` },
      {
        name: "description",
        content: t`Search listings, review fit, generate tailored summaries, and track applications — integrated into Reactive Resume.`,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main id="main-content" className="relative border-b pb-16 md:pb-24">
      <div className="container mx-auto max-w-6xl px-4 pt-28 sm:px-6 lg:px-12">
        <motion.div
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 gap-1.5 text-muted-foreground"
            nativeButton={false}
            render={
              <Link to="/">
                <ArrowLeftIcon className="size-4" aria-hidden />
                <Trans>Back to home</Trans>
              </Link>
            }
          />

          <Badge variant="secondary" className="mb-4 gap-1.5">
            <BriefcaseIcon className="size-3.5" weight="fill" aria-hidden />
            <Trans>AI Job Search</Trans>
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            <Trans>Turn job listings into tailored resumes</Trans>
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            <Trans>
              Explore the workflow: scan roles, read an AI fit assessment, refine your summary, and move a job to applied
              when you are ready — built for both light and dark themes.
            </Trans>
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button nativeButton={false} render={<Link to="/auth/login" />}>
              <Trans>Sign in to try it</Trans>
              <ArrowRightIcon className="size-4" aria-hidden />
            </Button>
            <Button variant="outline" nativeButton={false} render={<Link to="/dashboard/job-search" />}>
              <Trans>Open Job Search</Trans>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm"
        >
          <div className="border-b border-border bg-muted/50 px-4 py-2.5 md:px-5">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <Trans>Interface preview</Trans>
            </p>
          </div>

          <div className="bg-background p-4 md:p-6">
            <p
              className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base"
              aria-hidden="true"
            >
              <Trans>
                <span className="font-medium text-foreground">Welcome back.</span> Jobs are like buses—miss one, and
                another comes. Let’s not miss this one.
              </Trans>
            </p>

            <InterfacePreviewDemo />
          </div>
        </motion.div>

        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
          <Trans>
            Job listings use your configured provider. AI features use your own model credentials when enabled in
            settings.
          </Trans>
        </p>
      </div>
    </main>
  );
}

function InterfacePreviewDemo() {
  const jobTitle = t`Web Developer Intern`;
  const jobCompany = t`daogames GmbH`;
  const jobLocation = t`Germany | Remote`;
  const secondTitle = t`Senior Frontend Engineer`;
  const secondCompany = t`Example Corp`;
  const secondLocation = t`Hybrid · Berlin`;

  const fitAssessment = t`The role is entry-level and remote-friendly, which supports flexibility. Until your profile lists relevant web development skills and concrete experience, fit stays tentative—add internships, projects, or coursework so the assessment can strengthen.`;

  const tailoredSummary = t`Motivated aspiring web developer eager to contribute to daogames GmbH's products through hands-on internship experience, collaborative development, and continuous learning in a remote-first team.`;

  return (
    <div
      className="flex flex-col gap-4"
      role="region"
      aria-label={t`Sample AI job search layout. Interactive elements are for demonstration.`}
    >
      <Tabs defaultValue="ready" className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="h-9 w-full justify-start sm:w-auto">
            <TabsTrigger value="ready">
              <Trans>Ready</Trans>
            </TabsTrigger>
            <TabsTrigger value="discovered">
              <Trans>Discovered</Trans>
            </TabsTrigger>
            <TabsTrigger value="applied">
              <Trans>Applied</Trans>
            </TabsTrigger>
            <TabsTrigger value="all">
              <Trans>All Jobs</Trans>
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" type="button" className="gap-2 text-muted-foreground" disabled>
              <MagnifyingGlassIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              <span>
                <Trans>Search</Trans>
              </span>
              <KbdGroup className="ms-1" aria-hidden>
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </Button>
            <Button variant="outline" size="sm" type="button" className="gap-2" disabled>
              <FunnelSimpleIcon aria-hidden className="size-4" />
              <Trans>Filters</Trans>
            </Button>
          </div>
        </div>

        <TabsContent value="ready" className="mt-0">
          <div className="grid gap-4 lg:grid-cols-[minmax(240px,320px)_1fr] lg:gap-0 lg:divide-x lg:divide-border">
            <div className="flex min-h-[320px] flex-col lg:min-h-[480px] lg:pe-4">
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-3">
                <label className="flex cursor-default items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className="flex size-4 shrink-0 rounded-sm border border-input bg-background shadow-xs"
                    aria-hidden
                  />
                  <Trans>Select all filtered</Trans>
                </label>
                <span className="text-xs tabular-nums text-muted-foreground">
                  <Trans>0 selected</Trans>
                </span>
              </div>

              <ul className="flex flex-1 flex-col gap-2 overflow-y-auto pe-1">
                <li>
                  <div
                    className={cn(
                      "rounded-lg border p-3 transition-colors",
                      "border-primary/40 bg-primary/10 shadow-xs dark:border-primary/35 dark:bg-primary/15",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium leading-snug">{jobTitle}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {jobCompany} · {jobLocation}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold tabular-nums dark:bg-background/50"
                        aria-label={t`Match score ${DEMO_SCORE}`}
                      >
                        {DEMO_SCORE}
                      </span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 dark:bg-muted/10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium leading-snug text-muted-foreground">{secondTitle}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {secondCompany} · {secondLocation}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">72</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex min-h-0 flex-col gap-4 lg:ps-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight md:text-xl">{jobTitle}</h2>
                  <p className="text-sm text-muted-foreground">
                    {jobCompany} · {jobLocation}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    <Trans>Startup jobs</Trans>
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    <Trans>Remote</Trans>
                  </Badge>
                  <Button variant="ghost" size="sm" type="button" className="h-8 gap-1 px-2 text-primary" disabled>
                    <Trans>View</Trans>
                    <ArrowSquareOutIcon className="size-3.5" weight="bold" aria-hidden />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 px-3 py-3 dark:bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" aria-hidden />
                    <Trans>Ready</Trans>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-muted-foreground/40" aria-hidden />
                    <Trans>Tracker off</Trans>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-muted-foreground/40" aria-hidden />
                    <Trans>Sponsor not found</Trans>
                  </span>
                </div>
                <div className="flex w-full max-w-xs items-center gap-2 sm:w-44">
                  <Progress value={DEMO_SCORE} className="min-w-0 flex-1" />
                  <span className="text-sm font-medium tabular-nums text-muted-foreground">{DEMO_SCORE}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button variant="outline" size="sm" type="button" className="h-auto justify-start gap-2 py-2.5" disabled>
                  <PenNibIcon className="size-4 shrink-0" aria-hidden />
                  <Trans>Ghostwriter</Trans>
                </Button>
                <Button variant="outline" size="sm" type="button" className="h-auto justify-start gap-2 py-2.5" disabled>
                  <FileArrowDownIcon className="size-4 shrink-0" aria-hidden />
                  <Trans>Download PDF</Trans>
                </Button>
                <Button variant="outline" size="sm" type="button" className="h-auto justify-start gap-2 py-2.5" disabled>
                  <ArrowSquareOutIcon className="size-4 shrink-0" aria-hidden />
                  <Trans>Open job listing</Trans>
                </Button>
                <Button size="sm" type="button" className="h-auto justify-start gap-2 py-2.5" disabled>
                  <CheckIcon className="size-4 shrink-0" weight="bold" aria-hidden />
                  <Trans>Mark applied</Trans>
                </Button>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-muted/20 p-4 dark:bg-muted/10">
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <RobotIcon className="size-4 text-primary" aria-hidden />
                    <Trans>Fit assessment</Trans>
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90">{fitAssessment}</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 dark:bg-muted/10">
                  <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <Trans>Tailored summary</Trans>
                  </h3>
                  <p className="text-sm leading-relaxed italic text-foreground/90">{tailoredSummary}</p>
                </div>
              </div>

              <Accordion className="rounded-lg border border-border">
                <AccordionItem value="links" className="border-b border-border px-3 last:border-b-0">
                  <AccordionTrigger className="py-3 text-sm hover:no-underline">
                    <span className="flex items-center gap-2">
                      <LinkSimpleIcon className="size-4 text-muted-foreground" aria-hidden />
                      <Plural value={SEARCH_LINKS_COUNT} one="# search link" other="# search links" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 text-sm text-muted-foreground">
                    <Trans>Example saved searches and listing URLs will appear here in the app.</Trans>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="projects" className="px-3">
                  <AccordionTrigger className="py-3 text-sm hover:no-underline">
                    <span className="flex items-center gap-2">
                      <FolderOpenIcon className="size-4 text-muted-foreground" aria-hidden />
                      <Plural value={PROJECTS_COUNT} one="# project selected" other="# projects selected" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 text-sm text-muted-foreground">
                    <Trans>Link resumes or projects to track how you pitch each role.</Trans>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button variant="ghost" size="sm" type="button" className="w-full gap-1 text-muted-foreground" disabled>
                <Trans>More actions</Trans>
                <CaretDownIcon className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discovered" className="mt-0">
          <PlaceholderTab />
        </TabsContent>
        <TabsContent value="applied" className="mt-0">
          <PlaceholderTab />
        </TabsContent>
        <TabsContent value="all" className="mt-0">
          <PlaceholderTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlaceholderTab() {
  return (
    <p className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-12 text-center text-sm text-muted-foreground dark:bg-muted/10">
      <Trans>Additional queues use the same layout in the product — this page only demonstrates the Ready view.</Trans>
    </p>
  );
}
