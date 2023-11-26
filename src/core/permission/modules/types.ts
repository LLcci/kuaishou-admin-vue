import type { SysPermissionType } from './sys';
import type { NetdiskPermissionType } from './netdisk';
import type { kuaishouPermissionType } from '@/core/permission/modules/kuaishou';

export type PermissionType = ReplaceAll<
  SysPermissionType | NetdiskPermissionType | kuaishouPermissionType,
  '/',
  '.'
>;
