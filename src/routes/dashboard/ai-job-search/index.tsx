import { t } from "@lingui/core/macro";
import { Plural, Trans } from "@lingui/react/macro";
import {
  ArrowSquareOutIcon,
  BriefcaseIcon,
  BuildingsIcon,
  CaretDownIcon,
  CheckIcon,
  FileArrowDownIcon,
  FunnelSimpleIcon,
  LinkSimpleIcon,
  MagnifyingGlassIcon,
  PenNibIcon,
  RobotIcon,
  StarIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { useCommandPaletteStore } from "@/components/command-palette/store";

import type { JobResult } from "@/schema/jobs";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobPipelineStore } from "@/integrations/jobs/pipeline-store";
import { cn } from "@/utils/style";

import { DashboardHeader } from "../-components/header";
import { Route as DashboardRoute } from "../route";
import { JobDetailDescriptionSections } from "../job-search/-components/job-detail-description-sections";
import { TailorDialog } from "../job-search/-components/tailor-dialog";
import { countJobListingLinks, getQuotaStatus, isValidExternalUrl } from "../job-search/-components/job-utils";
import { hasActiveFilters, initialFilterState, SearchFilters } from "../job-search/-components/search-filters";
import { useJobSearch } from "../job-search/-components/use-job-search";

export const Route = createFileRoute("/dashboard/ai-job-search/")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: t`AI Job Search` }],
  }),
});

type PipelineTab = "ready" | "discovered" | "applied" | "all";

function RouteComponent() {
  const { session } = DashboardRoute.useRouteContext();
  const displayName = session.user.name?.split(/\s+/)[0] ?? session.user.name ?? "";

  const {
    activeFilterChips,
    currentPage,
    error,
    executeSearch,
    filters,
    handlePageChange,
    handleSearch,
    hasMore,
    hasSearched,
    isConfigured,
    isPending,
    jobs,
    query,
    quota,
    removeFilter,
    scrollRef,
    selectJobInline,
    selectedJob,
    setFilters,
    setQuery,
  } = useJobSearch();

  const savedJobIds = useJobPipelineStore((s) => s.savedJobIds);
  const appliedJobIds = useJobPipelineStore((s) => s.appliedJobIds);
  const toggleSaved = useJobPipelineStore((s) => s.toggleSaved);
  const markApplied = useJobPipelineStore((s) => s.markApplied);
  const unmarkApplied = useJobPipelineStore((s) => s.unmarkApplied);
  const isSaved = useJobPipelineStore((s) => s.isSaved);
  const isApplied = useJobPipelineStore((s) => s.isApplied);

  const [tab, setTab] = useState<PipelineTab>("ready");
  const [tailorOpen, setTailorOpen] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(() => new Set());

  const appliedSet = useMemo(() => new Set(appliedJobIds), [appliedJobIds]);
  const savedSet = useMemo(() => new Set(savedJobIds), [savedJobIds]);

  const filteredJobs = useMemo(() => {
    switch (tab) {
      case "ready":
        return jobs.filter((j) => !appliedSet.has(j.job_id));
      case "discovered":
        return jobs.filter((j) => savedSet.has(j.job_id));
      case "applied":
        return jobs.filter((j) => appliedSet.has(j.job_id));
      default:
        return jobs;
    }
  }, [jobs, tab, appliedSet, savedSet]);

  const selectedId = selectedJob?.job_id ?? null;

  useEffect(() => {
    const applied = new Set(appliedJobIds);
    const saved = new Set(savedJobIds);
    let list: JobResult[];
    switch (tab) {
      case "ready":
        list = jobs.filter((j) => !applied.has(j.job_id));
        break;
      case "discovered":
        list = jobs.filter((j) => saved.has(j.job_id));
        break;
      case "applied":
        list = jobs.filter((j) => applied.has(j.job_id));
        break;
      default:
        list = jobs;
    }
    if (list.length === 0) {
      selectJobInline(null);
      return;
    }
    const stillHere = selectedId != null && list.some((j) => j.job_id === selectedId);
    if (!stillHere) selectJobInline(list[0]);
  }, [tab, jobs, appliedJobIds, savedJobIds, selectedId, selectJobInline]);

  const showFilterChips = useMemo(() => hasActiveFilters(filters), [filters]);

  const openCommandPalette = () => {
    useCommandPaletteStore.getState().setOpen(true);
  };

  const toggleBulkAll = () => {
    if (bulkSelected.size === filteredJobs.length) {
      setBulkSelected(new Set());
      return;
    }
    setBulkSelected(new Set(filteredJobs.map((j) => j.job_id)));
  };

  const listingLinkCount = selectedJob ? countJobListingLinks(selectedJob) : 0;
  const matchScore = selectedJob?.job_apply_quality_score ?? null;
  const progressValue = matchScore != null ? Math.max(0, Math.min(100, Math.round(matchScore))) : 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <DashboardHeader icon={BriefcaseIcon} title={t`AI Job Search`} />

      <Separator />

      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {displayName ? (
          <>
            <span className="font-medium text-foreground">
              {t`Welcome back, ${displayName}.`}
            </span>{" "}
            {t`Jobs are like buses—miss one, and another comes. Let's line up the next right role here.`}
          </>
        ) : (
          <>
            <span className="font-medium text-foreground">{t`Welcome back.`}</span>{" "}
            {t`Jobs are like buses—miss one, and another comes. Let's line up the next right role here.`}
          </>
        )}
      </p>

      {!isConfigured ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-xl flex-col items-center gap-y-4 py-12 text-center"
        >
          <MagnifyingGlassIcon className="size-12 text-muted-foreground" weight="light" />
          <h2 className="text-lg font-medium">
            <Trans>Configure Job Search</Trans>
          </h2>
          <p className="text-muted-foreground">
            <Trans>To search for job listings, you need to configure your RapidAPI key in settings.</Trans>
          </p>
          <Button nativeButton={false} variant="outline" render={<Link to="/dashboard/settings/job-search" />}>
            <Trans>Go to Settings</Trans>
          </Button>
        </motion.div>
      ) : (
        <>
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-y-2">
              <Label htmlFor="ai-job-query">
                <Trans>Search</Trans>
              </Label>
              <Input
                id="ai-job-query"
                name="ai-job-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t`e.g. frontend developer jobs in Berlin`}
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <Button type="submit" disabled={isPending} className="shrink-0">
              {isPending ? <Spinner /> : <MagnifyingGlassIcon />}
              <Trans>Search</Trans>
            </Button>
          </form>

          <div ref={scrollRef} />

          <SearchFilters filters={filters} onFiltersChange={setFilters} />

          {showFilterChips && (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.value ?? chip.label}`}
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => removeFilter(chip.key, chip.value)}
                >
                  {chip.label}
                  <XIcon className="size-3" />
                </button>
              ))}
              <Button size="sm" variant="ghost" onClick={() => setFilters(initialFilterState)}>
                <Trans>Clear all</Trans>
              </Button>
            </div>
          )}

          {quota && (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  getQuotaStatus(quota) === "healthy" && "text-emerald-600",
                  getQuotaStatus(quota) === "warning" && "text-amber-600",
                  getQuotaStatus(quota) === "critical" && "text-red-600",
                )}
              >
                <Trans>Quota: {quota.remaining} remaining</Trans>
              </Badge>
              <p className="text-xs text-muted-foreground">
                <Trans>
                  {quota.used} / {quota.limit} requests used
                </Trans>
              </p>
            </div>
          )}

          {error && !isPending && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
              <div className="flex items-start gap-2">
                <WarningCircleIcon className="mt-0.5 size-4 text-destructive" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    <Trans>Could not fetch jobs</Trans>
                  </p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button size="sm" variant="outline" onClick={() => executeSearch(currentPage)}>
                    <Trans>Retry</Trans>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isPending && jobs.length === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-lg" />
              ))}
            </div>
          )}

          {!isPending && hasSearched && jobs.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              <Trans>No jobs found. Try a different search query.</Trans>
            </p>
          )}

          {jobs.length > 0 && (
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as PipelineTab)}
              className="flex min-h-0 flex-1 flex-col gap-3"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <TabsList variant="line" className="h-9 w-full justify-start lg:w-auto">
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
                  <Button variant="outline" size="sm" type="button" className="gap-2" onClick={openCommandPalette}>
                    <MagnifyingGlassIcon className="size-4" aria-hidden />
                    <Trans>Search</Trans>
                    <KbdGroup className="ms-1" aria-hidden>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>K</Kbd>
                    </KbdGroup>
                  </Button>
                  <Button variant="outline" size="sm" type="button" className="gap-2" render={<Link to="/dashboard/job-search" />}>
                    <FunnelSimpleIcon className="size-4" aria-hidden />
                    <Trans>Classic job search</Trans>
                  </Button>
                </div>
              </div>

              <TabsContent value={tab} className="mt-0 flex min-h-0 flex-1 data-[state=inactive]:hidden">
                {filteredJobs.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    <Trans>No jobs in this view for your current results. Try another tab or run a new search.</Trans>
                  </p>
                ) : (
                  <div className="grid min-h-[28rem] flex-1 gap-4 overflow-hidden rounded-xl border border-border bg-card/30 lg:grid-cols-[minmax(260px,320px)_1fr] lg:gap-0 lg:divide-x lg:divide-border dark:bg-card/20">
                    <div className="flex min-h-0 flex-col p-3 lg:max-h-[calc(100dvh-14rem)]">
                      <div className="mb-2 flex items-center justify-between gap-2 border-b border-border pb-2">
                        <button
                          type="button"
                          onClick={toggleBulkAll}
                          className="flex items-center gap-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <span
                            className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded-sm border border-input shadow-xs",
                              bulkSelected.size === filteredJobs.length && filteredJobs.length > 0
                                ? "bg-primary text-primary-foreground"
                                : "bg-background",
                            )}
                            aria-hidden
                          >
                            {bulkSelected.size === filteredJobs.length && filteredJobs.length > 0 ? (
                              <CheckIcon className="size-3" weight="bold" />
                            ) : null}
                          </span>
                          <Trans>Select all filtered</Trans>
                        </button>
                        <span className="text-xs tabular-nums text-muted-foreground">{t`${bulkSelected.size} selected`}</span>
                      </div>

                      <ScrollArea className="min-h-0 flex-1 pr-2">
                        <ul className="flex flex-col gap-2 pb-2">
                          {filteredJobs.map((job) => (
                            <li key={job.job_id}>
                              <JobRow
                                job={job}
                                selected={selectedJob?.job_id === job.job_id}
                                onSelect={() => selectJobInline(job)}
                                saved={isSaved(job.job_id)}
                                onToggleSaved={(e) => {
                                  e.stopPropagation();
                                  toggleSaved(job.job_id);
                                }}
                                score={job.job_apply_quality_score}
                              />
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>

                      <div className="mt-2 flex items-center justify-center gap-x-3 border-t border-border pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage <= 1 || isPending}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <Trans>Previous</Trans>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          <Trans>Page {currentPage}</Trans>
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!hasMore || isPending}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <Trans>Next</Trans>
                        </Button>
                      </div>
                    </div>

                    <ScrollArea className="min-h-[20rem] min-w-0 lg:max-h-[calc(100dvh-14rem)]">
                      <div className="space-y-4 p-3 md:p-4">
                        {selectedJob ? (
                          <SelectedJobPanel
                            job={selectedJob}
                            matchScore={matchScore}
                            progressValue={progressValue}
                            listingLinkCount={listingLinkCount}
                            applied={isApplied(selectedJob.job_id)}
                            tailorOpen={tailorOpen}
                            setTailorOpen={setTailorOpen}
                            onMarkApplied={() => markApplied(selectedJob.job_id)}
                            onUnmarkApplied={() => unmarkApplied(selectedJob.job_id)}
                            onToggleSaved={() => toggleSaved(selectedJob.job_id)}
                            saved={isSaved(selectedJob.job_id)}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            <Trans>Select a job from the list.</Trans>
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}

function ListingLinksList({ job }: { job: JobResult }) {
  const seen = new Set<string>();
  const entries: { href: string; label: string }[] = [];
  const push = (href: string, label: string) => {
    const key = href.trim();
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ href: key, label });
  };
  if (isValidExternalUrl(job.job_apply_link)) {
    push(job.job_apply_link, t`Primary apply URL`);
  }
  if (isValidExternalUrl(job.job_google_link)) {
    push(job.job_google_link!, t`Google Jobs listing`);
  }
  for (const option of job.apply_options) {
    if (isValidExternalUrl(option.apply_link)) {
      push(option.apply_link, option.publisher || t`Publisher apply link`);
    }
  }
  if (entries.length === 0) {
    return (
      <p className="text-sm">
        <Trans>No external links were returned for this job.</Trans>
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={`${entry.href}-${entry.label}`}>
          <a
            href={entry.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:underline"
          >
            <ArrowSquareOutIcon className="size-3.5 shrink-0" />
            {entry.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

type JobRowProps = {
  job: JobResult;
  selected: boolean;
  onSelect: () => void;
  saved: boolean;
  onToggleSaved: (e: React.MouseEvent) => void;
  score: number | null;
};

function JobRow({ job, selected, onSelect, saved, onToggleSaved, score }: JobRowProps) {
  const location = [job.job_city, job.job_country].filter(Boolean).join(", ");
  const subtitle = [job.employer_name, location].filter(Boolean).join(" · ");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "flex w-full cursor-pointer items-start gap-2 rounded-lg border p-3 text-start transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary/50 bg-primary/10 shadow-xs dark:border-primary/40 dark:bg-primary/15"
          : "border-border bg-background hover:bg-muted/50",
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSaved(e);
        }}
        className="mt-0.5 shrink-0 rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-amber-600"
        aria-label={saved ? t`Remove from discovered` : t`Save to discovered`}
      >
        <StarIcon className="size-4" weight={saved ? "fill" : "regular"} aria-hidden />
      </button>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-medium leading-snug">{job.job_title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {score != null && (
        <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">{Math.round(score)}</span>
      )}
    </div>
  );
}

type PanelProps = {
  job: JobResult;
  matchScore: number | null;
  progressValue: number;
  listingLinkCount: number;
  applied: boolean;
  saved: boolean;
  tailorOpen: boolean;
  setTailorOpen: (v: boolean) => void;
  onMarkApplied: () => void;
  onUnmarkApplied: () => void;
  onToggleSaved: () => void;
};

function SelectedJobPanel({
  job,
  matchScore,
  progressValue,
  listingLinkCount,
  applied,
  saved,
  tailorOpen,
  setTailorOpen,
  onMarkApplied,
  onUnmarkApplied,
  onToggleSaved,
}: PanelProps) {
  const location = [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ");
  const hasApply = isValidExternalUrl(job.job_apply_link);
  const listingUrl = hasApply ? job.job_apply_link : job.job_google_link;
  const hasListing = isValidExternalUrl(listingUrl);

  const exp = job.job_required_experience;
  const fitLines: string[] = [];
  if (exp.no_experience_required) fitLines.push(t`No strict experience minimum is advertised.`);
  if (exp.required_experience_in_months != null) {
    fitLines.push(t`Listed experience window: about ${exp.required_experience_in_months} months.`);
  }
  if (exp.experience_preferred) fitLines.push(t`Experience appears preferred rather than mandatory.`);

  const projectsCount = 0;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          {job.employer_logo ? (
            <img src={job.employer_logo} alt="" className="size-12 shrink-0 rounded-md object-contain" />
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
              <BuildingsIcon className="size-6 text-muted-foreground" aria-hidden />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight md:text-xl">{job.job_title}</h2>
            <p className="text-sm text-muted-foreground">
              {job.employer_name}
              {location ? ` · ${location}` : ""}
              {job.job_is_remote ? ` · ${t`Remote`}` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {job.employer_company_type ? (
            <Badge variant="outline" className="text-[10px] font-normal uppercase">
              {job.employer_company_type}
            </Badge>
          ) : null}
          {job.job_is_remote ? (
            <Badge variant="secondary" className="font-normal">
              <Trans>Remote</Trans>
            </Badge>
          ) : null}
          {hasListing ? (
            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2" nativeButton={false} render={<a href={listingUrl!} target="_blank" rel="noopener noreferrer" />}>
              <Trans>View listing</Trans>
              <ArrowSquareOutIcon className="size-3.5" weight="bold" aria-hidden />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 px-3 py-3 sm:flex-row sm:items-center sm:justify-between dark:bg-muted/20">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span
              className={cn("size-1.5 rounded-full", applied ? "bg-muted-foreground/40" : "bg-emerald-500 dark:bg-emerald-400")}
              aria-hidden
            />
            {applied ? <Trans>Applied</Trans> : <Trans>Ready</Trans>}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-muted-foreground/40" aria-hidden />
            <Trans>Tracker off</Trans>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-muted-foreground/40" aria-hidden />
            <Trans>
              Publisher: {job.job_publisher || t`Unknown`}
            </Trans>
          </span>
        </div>
        {matchScore != null ? (
          <div className="flex w-full max-w-xs items-center gap-2 sm:w-44">
            <Progress value={progressValue} className="min-w-0 flex-1" />
            <span className="text-sm font-medium tabular-nums text-muted-foreground">{Math.round(matchScore)}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            <Trans>No listing quality score from provider</Trans>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button variant="outline" size="sm" type="button" className="h-auto justify-start gap-2 py-2.5" onClick={() => setTailorOpen(true)}>
          <PenNibIcon className="size-4 shrink-0" aria-hidden />
          <Trans>Ghostwriter</Trans>
        </Button>
        <Button variant="outline" size="sm" type="button" className="h-auto justify-start gap-2 py-2.5" nativeButton={false} render={<Link to="/dashboard/resumes" />}>
          <FileArrowDownIcon className="size-4 shrink-0" aria-hidden />
          <Trans>Resumes & export</Trans>
        </Button>
        {hasListing ? (
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="h-auto justify-start gap-2 py-2.5"
            nativeButton={false}
            render={<a href={listingUrl!} target="_blank" rel="noopener noreferrer" />}
          >
            <ArrowSquareOutIcon className="size-4 shrink-0" aria-hidden />
            <Trans>Open job listing</Trans>
          </Button>
        ) : (
          <Button variant="outline" size="sm" type="button" className="h-auto justify-start gap-2 py-2.5" disabled>
            <ArrowSquareOutIcon className="size-4 shrink-0" aria-hidden />
            <Trans>Open job listing</Trans>
          </Button>
        )}
        {applied ? (
          <Button size="sm" type="button" variant="outline" className="h-auto justify-start gap-2 py-2.5" onClick={onUnmarkApplied}>
            <Trans>Mark not applied</Trans>
          </Button>
        ) : (
          <Button size="sm" type="button" className="h-auto justify-start gap-2 py-2.5" onClick={onMarkApplied}>
            <CheckIcon className="size-4 shrink-0" weight="bold" aria-hidden />
            <Trans>Mark applied</Trans>
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-muted/20 p-4 dark:bg-muted/10">
          <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <RobotIcon className="size-4 text-primary" aria-hidden />
            <Trans>Role fit factors</Trans>
          </h3>
          {job.job_required_skills && job.job_required_skills.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {job.job_required_skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}
          {fitLines.length > 0 ? (
            <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-foreground/90">
              {fitLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              <Trans>No structured experience hints were provided for this listing.</Trans>
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            <Trans>For a resume-aware narrative, run Ghostwriter (tailor) with a CV you manage in Reactive Resume.</Trans>
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-4 dark:bg-muted/10">
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <Trans>Tailored summary</Trans>
          </h3>
          <p className="text-sm italic text-muted-foreground">
            <Trans>After tailoring, your summary and highlights live in the duplicated resume in the builder.</Trans>
          </p>
          <Button size="sm" variant="secondary" className="mt-3" type="button" onClick={() => setTailorOpen(true)}>
            <Trans>Tailor a resume</Trans>
          </Button>
        </div>
      </div>

      <Accordion className="rounded-lg border border-border">
        <AccordionItem value="links" className="border-b border-border px-3 last:border-b-0">
          <AccordionTrigger className="py-3 text-sm hover:no-underline">
            <span className="flex items-center gap-2">
              <LinkSimpleIcon className="size-4 text-muted-foreground" aria-hidden />
              <Plural value={listingLinkCount} one="# listing link" other="# listing links" />
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 text-sm text-muted-foreground">
            <ListingLinksList job={job} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="projects" className="px-3">
          <AccordionTrigger className="py-3 text-sm hover:no-underline">
            <span className="flex items-center gap-2">
              <BriefcaseIcon className="size-4 text-muted-foreground" aria-hidden />
              <Plural value={projectsCount} one="# project linked" other="# projects linked" />
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3 text-sm text-muted-foreground">
            <Trans>Linking projects to applications is not available yet—use resumes to track tailored versions.</Trans>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div>
        <h3 className="mb-2 text-sm font-medium">
          <Trans>Full listing</Trans>
        </h3>
        <JobDetailDescriptionSections job={job} />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="sm" type="button" className="w-full gap-1 text-muted-foreground">
              <Trans>More actions</Trans>
              <CaretDownIcon className="size-4" aria-hidden />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={onToggleSaved}>
            {saved ? <Trans>Remove from discovered</Trans> : <Trans>Save to discovered</Trans>}
          </DropdownMenuItem>
          <Link to="/dashboard/job-search">
            <DropdownMenuItem>
              <Trans>Open classic layout</Trans>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>

      <TailorDialog job={job} open={tailorOpen} onOpenChange={setTailorOpen} />
    </>
  );
}
