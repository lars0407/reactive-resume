import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  BriefcaseIcon,
  ChatTeardropTextIcon,
  FileArrowUpIcon,
  KeyIcon,
  type Icon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useMemo } from "react";

import { cn } from "@/utils/style";

type AIFeature = {
  id: string;
  icon: Icon;
  title: string;
  description: string;
};

const getAiFeatures = (): AIFeature[] => [
  {
    id: "assistant",
    icon: ChatTeardropTextIcon,
    title: t`AI resume assistant`,
    description: t`Chat with an assistant that refines your content and applies edits safely to your resume.`,
  },
  {
    id: "import",
    icon: FileArrowUpIcon,
    title: t`Smart import from PDF & Word`,
    description: t`Upload an existing résumé and let AI extract structured data you can edit in the builder.`,
  },
  {
    id: "tailor",
    icon: BriefcaseIcon,
    title: t`Job-specific tailoring`,
    description: t`Adapt your resume to a role and employer with suggestions tuned for clarity and ATS-friendly wording.`,
  },
  {
    id: "byok",
    icon: KeyIcon,
    title: t`Bring your own API keys`,
    description: t`Connect OpenAI, Google, Anthropic, or a local Ollama model—your keys stay on your side when you self-host.`,
  },
];

function AiFeatureCard({ icon: Icon, title, description }: AIFeature) {
  return (
    <motion.div
      className={cn(
        "group relative flex min-h-48 flex-col gap-4 overflow-hidden border-b bg-background p-6 transition-[background-color] duration-300 will-change-[transform,opacity]",
        "not-nth-[2n]:border-r xl:not-nth-[4n]:border-r",
        "hover:bg-secondary/30",
      )}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div aria-hidden="true" className="relative">
        <div className="inline-flex rounded-md bg-primary/5 p-2.5 text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <Icon size={24} weight="thin" />
        </div>
      </div>

      <div className="relative flex flex-col gap-y-1.5">
        <h3 className="text-base font-semibold tracking-tight transition-colors group-hover:text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

export function AiFeatures() {
  const items = useMemo(() => getAiFeatures(), []);

  return (
    <section id="ai">
      <motion.div
        className="space-y-4 p-4 will-change-[transform,opacity] md:p-8 xl:py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl xl:text-5xl">
          <Trans>AI features</Trans>
        </h2>

        <p className="max-w-2xl leading-relaxed text-muted-foreground">
          <Trans>
            Optional intelligence that helps you write, import, and target your resume—enabled when you choose a model
            and add your own credentials.
          </Trans>
        </p>
      </motion.div>

      <div className="xs:grid-cols-2 grid grid-cols-1 border-t xl:grid-cols-4">
        {items.map((item) => (
          <AiFeatureCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
