export const report = {
  page: 'kuaishou/report/page',
  export: 'kuaishou/report/export',
  tianyanPage: 'kuaishou/report/tianyanPage',
} as const;

export const values = Object.values(report);

export type ReportPerms = (typeof values)[number];

export default report;
