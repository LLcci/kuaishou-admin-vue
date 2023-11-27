export const report = {
  page: 'kuaishou/report/page',
  exXls: 'kuaishou/report/exXls',
} as const;

export const values = Object.values(report);

export type ReportPerms = (typeof values)[number];

export default report;
