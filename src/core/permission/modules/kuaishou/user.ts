export const user = {
  add: 'kuaishou/user/add',
  info: 'kuaishou/user/info',
  page: 'kuaishou/user/page',
  update: 'kuaishou/user/update',
  delete: 'kuaishou/user/delete',
  list: 'kuaishou/user/list',
} as const;

export const values = Object.values(user);

export type UserPerms = (typeof values)[number];

export default user;
