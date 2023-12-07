export const account = {
  add: 'kuaishou/account/add',
  info: 'kuaishou/account/info',
  page: 'kuaishou/account/page',
  update: 'kuaishou/account/update',
  delete: 'kuaishou/account/delete',
  list: 'kuaishou/account/list',
} as const;

export const values = Object.values(account);

export type AccountPerms = (typeof values)[number];

export default account;
