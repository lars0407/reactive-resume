import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  ChatTeardropTextIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Step = {
  icon: typeof MagnifyingGlassIcon;
  title: string;
  description: string;
};

const getSteps = (): Step[] => [
  {
    icon: MagnifyingGlassIcon,
    title: t`Search real listings`,
    description: t`Query jobs with filters that match how you work, powered by the same Job Search experience in your dashboard.`,
  },
  {
    icon: SparkleIcon,
    title: t`Tailor with AI`,
    description: t`Duplicate a resume and apply structured AI suggestions so your highlights align with the role and employer.`,
  },
  {
    icon: ChatTeardropTextIcon,
    title: t`Edit safely in the builder`,
    description: t`Review every change in the resume editor, then export or share when you are ready.`,
  },
];

export const Route = createFileRoute("/_home/ai-job-search")({
  head: () => ({
    meta: [
      { title: t`AI Job Search — Reactive Resume` },
      {
        name: "description",
        content: t`Search listings, shortlist roles, and tailor your resume with AI — integrated into Reactive Resume.`,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const steps = useMemo(() => getSteps(), []);

  return (
    <main id="main-content" className="relative border-b pb-24">
      <div className="container mx-auto max-w-3xl px-4 pt-28 sm:px-6 lg:px-12">
        <motion.div
          className="mb-10"
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
              AI Job Search brings discovery and tailoring together: find roles, open the details that matter, and let
              your assistant reshape your resume for that specific posting—without leaving Reactive Resume.
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

          <p className="mt-4 text-sm text-muted-foreground">
            <Trans>
              Job listings require a configured provider key in settings. AI tailoring uses your own model credentials
              when enabled.
            </Trans>
          </p>
        </motion.div>

        <ol className="space-y-6 border-t pt-10">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.li
                key={step.title}
                className="flex gap-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-secondary/40 text-foreground">
                  <Icon className="size-5" weight="thin" aria-hidden />
                </div>
                <div>
                  <h2 className="text-base font-semibold tracking-tight">{step.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
