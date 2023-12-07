export const warning = {
  add: 'kuaishou/warning/add',
  info: 'kuaishou/warning/info',
  page: 'kuaishou/warning/page',
  update: 'kuaishou/warning/update',
  delete: 'kuaishou/warning/delete',
  enable: 'kuaishou/warning/enable',
  disable: 'kuaishou/warning/disable',
} as const;

export const values = Object.values(warning);

export type WarningPerms = (typeof values)[number];

export default warning;
