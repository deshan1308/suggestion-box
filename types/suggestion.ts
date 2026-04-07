export const STATUSES = ["New", "Reviewed", "Actioned"] as const;

export type SuggestionStatus = (typeof STATUSES)[number];

export interface Suggestion {
  id: string;
  suggestion: string;
  status: SuggestionStatus;
  created_at: string;
}
