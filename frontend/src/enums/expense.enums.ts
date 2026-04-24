export const SortOrder = {
  DATE_DESC: "date_desc",
  DATE_ASC: "date_asc",
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];