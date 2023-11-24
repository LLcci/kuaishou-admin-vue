export const user = {
  add: 'kuaishou/user/add',
  info: 'kuaishou/user/info',
  page: 'kuaishou/user/page',
  update: 'kuaishou/user/update',
  delete: 'kuaishou/user/delete',
} as const;

export const values = Object.values(user);

export type SysUserPerms = (typeof values)[number];

export default user;
