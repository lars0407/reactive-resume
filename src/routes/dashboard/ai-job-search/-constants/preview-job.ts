import { jobResultSchema } from "@/schema/jobs";

/** Stable id — pipeline / tailor should ignore this row. */
export const AI_JOB_SEARCH_PREVIEW_JOB_ID = "__rxr-ai-job-search-preview__";

/**
 * Example listing so the AI Job Search layout is visible before JSearch is configured.
 * Parsed through the schema so it stays aligned with `JobResult`.
 */
export const aiJobSearchPreviewJob = jobResultSchema.parse({
  job_id: AI_JOB_SEARCH_PREVIEW_JOB_ID,
  job_title: "Web Developer Intern",
  employer_name: "daogames GmbH",
  employer_logo: null,
  job_city: "",
  job_state: "",
  job_country: "Germany",
  job_is_remote: true,
  employer_company_type: "Startup",
  job_employment_type: "INTERN",
  job_apply_quality_score: 58,
  job_apply_link: "https://rxresu.me/",
  job_google_link: "https://rxresu.me/",
  job_description:
    "<p>This is a static example so you can explore the AI Job Search workspace. Add your RapidAPI key under Settings → Job Search API to load real listings.</p><p>After the API is configured, you can use Ghostwriter and the pipeline on live results.</p>",
  job_required_skills: ["HTML", "CSS", "JavaScript", "Git"],
  job_publisher: "Preview",
  job_benefits: null,
  job_highlights: null,
  apply_options: [
    {
      publisher: "Example board",
      apply_link: "https://rxresu.me/",
      is_direct: true,
    },
  ],
  job_required_experience: {
    no_experience_required: true,
    required_experience_in_months: null,
    experience_mentioned: true,
    experience_preferred: true,
  },
});
