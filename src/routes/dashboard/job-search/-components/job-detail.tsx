import { Trans } from "@lingui/react/macro";
import {
  ArrowSquareOutIcon,
  BriefcaseIcon,
  BuildingsIcon,
  ClockIcon,
  GlobeIcon,
  MapPinIcon,
  MoneyIcon,
  StarIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import type { JobResult } from "@/schema/jobs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatSalary, isValidExternalUrl } from "./job-utils";
import { JobDetailDescriptionSections } from "./job-detail-description-sections";
import { TailorDialog } from "./tailor-dialog";

type Props = {
  job: JobResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JobDetailSheet({ job, open, onOpenChange }: Props) {
  const [tailorOpen, setTailorOpen] = useState(false);

  if (!job) return null;

  const salary = formatSalary(job.job_min_salary, job.job_max_salary, job.job_salary_currency, job.job_salary_period);
  const location = [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ");
  const hasApplyLink = isValidExternalUrl(job.job_apply_link);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="data-[side=right]:sm:w-[30vw] data-[side=right]:sm:max-w-none data-[side=right]:sm:min-w-[400px]"
        >
          <SheetHeader>
            <div className="flex items-start gap-x-3">
              {job.employer_logo ? (
                <img
                  src={job.employer_logo}
                  alt={job.employer_name}
                  className="size-12 shrink-0 rounded-md object-contain"
                />
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                  <BuildingsIcon className="size-6 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-lg">{job.job_title}</SheetTitle>
                <SheetDescription>{job.employer_name}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="min-h-0 flex-1 px-4">
            <div className="flex flex-col gap-y-4 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                {location && (
                  <Badge variant="secondary" className="gap-x-1">
                    <MapPinIcon className="size-3" />
                    {location}
                  </Badge>
                )}

                {job.job_is_remote && (
                  <Badge variant="secondary" className="gap-x-1">
                    <GlobeIcon className="size-3" />
                    <Trans>Remote</Trans>
                  </Badge>
                )}

                {job.job_employment_type && (
                  <Badge variant="secondary" className="gap-x-1">
                    <BriefcaseIcon className="size-3" />
                    {job.job_employment_type.replaceAll("_", " ")}
                  </Badge>
                )}

                {salary && (
                  <Badge variant="secondary" className="gap-x-1">
                    <MoneyIcon className="size-3" />
                    {salary}
                  </Badge>
                )}

                {job.job_posted_at_datetime_utc && (
                  <Badge variant="outline" className="gap-x-1">
                    <ClockIcon className="size-3" />
                    {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
                  </Badge>
                )}
              </div>

              <div className="flex gap-x-2">
                <Button
                  className="flex-1"
                  nativeButton={false}
                  disabled={!hasApplyLink}
                  render={
                    <a href={hasApplyLink ? job.job_apply_link : "#"} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <ArrowSquareOutIcon />
                  <Trans>Apply</Trans>
                </Button>

                <Button variant="outline" className="flex-1" onClick={() => setTailorOpen(true)}>
                  <StarIcon />
                  <Trans>Tailor Resume</Trans>
                </Button>
              </div>

              <Separator />

              <JobDetailDescriptionSections job={job} />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <TailorDialog job={job} open={tailorOpen} onOpenChange={setTailorOpen} />
    </>
  );
}
