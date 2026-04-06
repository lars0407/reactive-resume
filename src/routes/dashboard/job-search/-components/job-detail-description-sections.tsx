import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";

import type { JobResult } from "@/schema/jobs";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { sanitizeHtml } from "@/utils/sanitize";

import { isValidExternalUrl } from "./job-utils";

type Props = {
  job: JobResult;
};

/**
 * Shared description, highlights, skills, benefits and apply links — used by the job sheet and AI Job Search detail panel.
 */
export function JobDetailDescriptionSections({ job }: Props) {
  return (
    <>
      {job.job_description && (
        <div className="flex flex-col gap-y-2">
          <h4 className="font-medium">
            <Trans>Description</Trans>
          </h4>
          <div
            className="text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-foreground [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-foreground [&_li]:ml-4 [&_ol]:list-decimal [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.job_description) }}
          />
        </div>
      )}

      {job.job_highlights && Object.keys(job.job_highlights).length > 0 && (
        <>
          <Separator />
          {Object.entries(job.job_highlights).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-y-2">
              <h4 className="font-medium capitalize">{category.replaceAll("_", " ")}</h4>
              <ul className="list-inside list-disc space-y-1">
                {(items as string[]).map((item: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {job.job_required_skills && job.job_required_skills.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-y-2">
            <h4 className="font-medium">
              <Trans>Required Skills</Trans>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.job_required_skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {job.job_benefits && job.job_benefits.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-y-2">
            <h4 className="font-medium">
              <Trans>Benefits</Trans>
            </h4>
            <ul className="list-inside list-disc space-y-1">
              {job.job_benefits.map((benefit) => (
                <li key={benefit} className="text-sm text-muted-foreground">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {job.apply_options.some((option) => isValidExternalUrl(option.apply_link)) && (
        <>
          <Separator />
          <div className="flex flex-col gap-y-2">
            <h4 className="font-medium">
              <Trans>Apply Via</Trans>
            </h4>
            <div className="flex flex-col gap-y-1.5">
              {job.apply_options
                .filter((option) => isValidExternalUrl(option.apply_link))
                .map((option, i) => (
                  <a
                    key={i}
                    href={option.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-x-2 text-sm text-primary hover:underline"
                  >
                    <ArrowSquareOutIcon className="size-3.5 shrink-0" />
                    {option.publisher || t`Apply Link`}
                    {option.is_direct && (
                      <Badge variant="outline" className="text-[10px]">
                        <Trans>Direct</Trans>
                      </Badge>
                    )}
                  </a>
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
