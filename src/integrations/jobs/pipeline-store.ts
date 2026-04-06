import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand/react";

type JobPipelineState = {
  savedJobIds: string[];
  appliedJobIds: string[];
};

type JobPipelineActions = {
  toggleSaved: (jobId: string) => void;
  markApplied: (jobId: string) => void;
  unmarkApplied: (jobId: string) => void;
  isSaved: (jobId: string) => boolean;
  isApplied: (jobId: string) => boolean;
};

export type JobPipelineStore = JobPipelineState & JobPipelineActions;

const initialState: JobPipelineState = {
  savedJobIds: [],
  appliedJobIds: [],
};

export const useJobPipelineStore = create<JobPipelineStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      toggleSaved: (jobId: string) => {
        set((draft) => {
          const idx = draft.savedJobIds.indexOf(jobId);
          if (idx >= 0) draft.savedJobIds.splice(idx, 1);
          else draft.savedJobIds.push(jobId);
        });
      },

      markApplied: (jobId: string) => {
        set((draft) => {
          if (!draft.appliedJobIds.includes(jobId)) draft.appliedJobIds.push(jobId);
        });
      },

      unmarkApplied: (jobId: string) => {
        set((draft) => {
          draft.appliedJobIds = draft.appliedJobIds.filter((id) => id !== jobId);
        });
      },

      isSaved: (jobId: string) => get().savedJobIds.includes(jobId),

      isApplied: (jobId: string) => get().appliedJobIds.includes(jobId),
    })),
    {
      name: "reactive-resume-job-pipeline",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
