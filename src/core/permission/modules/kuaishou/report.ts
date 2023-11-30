export const report = {
  page: 'kuaishou/report/page',
  export: 'kuaishou/report/export',
} as const;

export const values = Object.values(report);

export type ReportPerms = (typeof values)[number];

export default report;
